const $ = (selector) => document.querySelector(selector);
const state = { file: null, rawMessages: [], messages: [], aliases: new Map(), redaction: null };

const PATTERNS = [
  {
    id: 'capability_supply', label: '能力供给与负荷', lens: 'capability_supply',
    words: ['不会','不熟','没经验','能力不够','做不了','没人','缺人','招人','借人','忙不过来','扛不住','加班','人手'],
    question: '这更像短期工作量波动，还是一项需要稳定拥有、培养或灵活调用的能力？',
    actions: ['先核对内部可用性与导师窗口','区分连续核心能力与阶段性专项需求','再讨论培养、内部流动、外部灵活供给或招聘的组合']
  },
  {
    id: 'interface', label: '跨角色接口与协同', lens: 'decision_or_information_interface',
    words: ['对接','联调','接口','对不上','沟通','协同','配合','交接','等反馈','等确认','扯皮','来回','返工','改了又改'],
    question: '问题来自某个具体任务，还是输入、决策权、验收标准或交接机制缺失？',
    actions: ['画出任务的输入、输出与验收接口','明确一个跨界 Owner 与升级路径','先做小范围协同机制试验，再判断是否需要新增岗位']
  },
  {
    id: 'operating_mechanism', label: '优先级、责任与运行机制', lens: 'operating_mechanism',
    words: ['谁负责','没人负责','优先级','排期','流程','决策','拍板','版本','资源','冲突','重复','各做各的','没有标准'],
    question: '这是能力不足，还是组织尚未把责任、优先级、版本或资源规则说清楚？',
    actions: ['补足共同目标、Owner 与关键决策机制','建立跨项目资源优先级与复盘节奏','确认机制稳定后，再评估能力供给缺口']
  },
  {
    id: 'delivery_risk', label: '交付风险与反复阻塞', lens: 'local_delivery_issue',
    words: ['延期','来不及','赶不上','卡住','失败','出问题','风险','拖','阻塞','上线不了','质量','bug','返修','救火'],
    question: '这是可局部修复的一次事件，还是持续暴露出能力、接口或资源配置问题？',
    actions: ['先隔离当前交付风险并记录原因','检查类似问题是否跨任务重复','只有重复且跨边界时，才升级为组织能力候选']
  },
  {
    id: 'external_dependency', label: '外部依赖与可调用资源', lens: 'resource_allocation',
    words: ['外包','供应商','顾问','采购','第三方','找外面','外部','按小时','服务商','临时'],
    question: '外部资源是在补一个可独立交付的单元，还是正在代替组织必须保留的关键责任？',
    actions: ['明确外部单元的交付物、接口与验收','保留内部 Integration Owner','评估外部依赖的时间、质量、上下文与责任风险']
  }
];

function baseText(value) { return String(value ?? '').trim(); }

function normalizeTimestamp(value) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'number' || /^\d{10,13}$/.test(String(value))) {
    const numeric = Number(value);
    const milliseconds = String(Math.trunc(numeric)).length === 10 ? numeric * 1000 : numeric;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
  }
  return String(value).trim();
}

function redactionTerms() {
  return $('#customTerms').value.split(/\r?\n/).map(term => term.trim()).filter(Boolean)
    .filter(term => term.length >= 2).sort((a, b) => b.length - a.length);
}

function redactText(value, terms = []) {
  let text = baseText(value);
  const hits = { links: 0, emails: 0, phones: 0, longNumbers: 0, customTerms: 0 };
  const replace = (pattern, replacement, key) => {
    text = text.replace(pattern, () => { hits[key] += 1; return replacement; });
  };
  replace(/https?:\/\/\S+/gi, '[链接已隐藏]', 'links');
  replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[邮箱已隐藏]', 'emails');
  replace(/(?<!\d)1\d{10}(?!\d)/g, '[手机号已隐藏]', 'phones');
  replace(/(?<!\d)\d{15,19}(?!\d)/g, '[号码已隐藏]', 'longNumbers');
  terms.forEach((term, index) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    replace(new RegExp(escaped, 'g'), `[敏感词-${String(index + 1).padStart(2, '0')}]`, 'customTerms');
  });
  return { text: text.trim(), hits };
}

function aliasFor(name) {
  const key = baseText(name || 'unknown') || 'unknown';
  if (!state.aliases.has(key)) state.aliases.set(key, `participant-${String(state.aliases.size + 1).padStart(2, '0')}`);
  return state.aliases.get(key);
}

function normalize(raw, index) {
  const object = raw && typeof raw === 'object' ? raw : {};
  const text = object.text ?? object.content ?? object.message ?? object.body ?? object.msg ?? object.payload?.text ?? '';
  const name = object.author?.name ?? object.author ?? object.sender?.name ?? object.sender ?? object.from ?? object.nickname ?? object.user ?? 'unknown';
  const sentAt = object.sentAt ?? object.timestamp ?? object.time ?? object.date ?? object.created_at ?? object.createdAt ?? '';
  return {
    id: `m-${index + 1}`,
    sequence: index + 1,
    sentAt: normalizeTimestamp(sentAt),
    rawAuthor: typeof name === 'string' ? name : 'unknown',
    rawText: baseText(typeof text === 'string' ? text : JSON.stringify(text)),
    author: aliasFor(typeof name === 'string' ? name : 'unknown'),
    text: baseText(typeof text === 'string' ? text : JSON.stringify(text)),
    completeness: sentAt && name ? 'full' : 'partial'
  };
}

function findMessageArray(value, depth = 0) {
  if (depth > 4 || !value) return null;
  if (Array.isArray(value)) {
    const resemblesMessages = value.filter(item => item && typeof item === 'object' && ('text' in item || 'content' in item || 'message' in item || 'msg' in item)).length;
    if (resemblesMessages) return value;
    for (const item of value) { const found = findMessageArray(item, depth + 1); if (found) return found; }
  }
  if (typeof value === 'object') {
    for (const key of ['messages','messageList','records','items','data','list','chatHistory']) {
      if (value[key]) { const found = findMessageArray(value[key], depth + 1); if (found) return found; }
    }
  }
  return null;
}

function parseJson(text) {
  const data = JSON.parse(text);
  const rows = findMessageArray(data) || (Array.isArray(data) ? data : null);
  if (!rows) throw new Error('未在 JSON 中找到可识别的消息数组。后续可通过脱敏的字段结构样例补充对应 Adapter。');
  return rows.map(normalize).filter(message => message.text);
}

function parseMarkdown(text) {
  const rows = [];
  let last = null;
  const dated = /^(?:(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)\s+)?([^:\n：]{1,40})[：:]\s*(.+)$/;
  text.split(/\r?\n/).forEach(line => {
    const match = line.trim().match(dated);
    if (match) {
      last = normalize({ sentAt: match[1] || '', author: match[2], text: match[3] }, rows.length);
      rows.push(last);
    } else if (last && line.trim()) {
      last.rawText = baseText(`${last.rawText} ${line.trim()}`);
      last.text = last.rawText;
    }
  });
  if (!rows.length) throw new Error('未识别 Markdown 消息边界。请使用“日期 时间 发言人：内容”或“发言人：内容”的格式。');
  return rows;
}

function mergeHits(target, source) {
  Object.keys(target).forEach(key => { target[key] += source[key] || 0; });
}

function rebuildRedactedMessages() {
  const terms = redactionTerms();
  state.aliases = new Map();
  const totals = { links: 0, emails: 0, phones: 0, longNumbers: 0, customTerms: 0, authors: 0 };
  state.messages = state.rawMessages.map(message => {
    const content = redactText(message.rawText, terms);
    mergeHits(totals, content.hits);
    const author = aliasFor(message.rawAuthor);
    return { ...message, author, text: content.text };
  });
  totals.authors = state.aliases.size;
  state.redaction = { terms, totals };
  renderRedactionWorkbench();
}

function renderRedactionWorkbench() {
  const { totals, terms } = state.redaction;
  $('#redactionWorkbench').hidden = false;
  $('#redactionSummary').innerHTML = `<strong>本次替换：</strong>${totals.authors} 位发言人已代号化 · 手机号 ${totals.phones} · 邮箱 ${totals.emails} · 长号码 ${totals.longNumbers} · 链接 ${totals.links} · 自定义敏感词 ${totals.customTerms}${terms.length ? `（${terms.length} 个词）` : ''}。`;
  $('#redactionPreview').innerHTML = state.messages.slice(0, 8).map(message => `<article class="preview-message"><small>${message.author}${message.sentAt ? ` · ${escapeHtml(message.sentAt)}` : ''}</small><p>${escapeHtml(message.text)}</p></article>`).join('') || '<p>没有可预览的消息。</p>';
}

function downloadRedactedCopy() {
  if (!state.messages.length) return;
  const payload = {
    notice: '此文件为本地脱敏副本。请在分享或调用外部模型前继续人工复核；不保证完全匿名化。',
    exportedAt: new Date().toISOString(),
    messages: state.messages.map(({ id, sequence, sentAt, author, text, completeness }) => ({ id, sequence, sentAt, author, text, completeness }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `${state.file?.name?.replace(/\.[^.]+$/, '') || 'conversation'}-redacted.json`;
  document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

function displaySummary() {
  const full = state.messages.filter(m => m.completeness === 'full').length;
  const authors = new Set(state.messages.map(m => m.author)).size;
  $('#importSummary').classList.remove('empty');
  $('#importSummary').innerHTML = `<strong>已在本地读取：</strong>${state.file.name} · ${state.messages.length} 条消息 · ${authors} 位匿名参与者 · ${full}/${state.messages.length} 条记录含完整时间与发言人信息。`;
  $('#importState').textContent = '待复核脱敏';
  $('#importState').className = 'state-pill ready';
  renderDataQuality();
}

function renderDataQuality() {
  const dates = state.messages.map(message => new Date(message.sentAt)).filter(date => !Number.isNaN(date.getTime())).sort((a, b) => a - b);
  const partial = state.messages.filter(message => message.completeness === 'partial').length;
  const seen = new Set();
  const duplicates = state.messages.reduce((count, message) => {
    const key = `${message.author}|${message.sentAt}|${message.text}`;
    if (seen.has(key)) return count + 1;
    seen.add(key); return count;
  }, 0);
  const range = dates.length ? `${dates[0].toLocaleDateString('zh-CN')} 至 ${dates.at(-1).toLocaleDateString('zh-CN')}` : '缺少可识别时间';
  $('#dataQuality').hidden = false;
  $('#dataQuality').innerHTML = `<p class="summary"><strong>数据质量：</strong>时间窗 ${range} · ${state.messages.length - partial}/${state.messages.length} 条含时间与发言人 · ${duplicates ? `${duplicates} 条完全重复消息待人工判断` : '未发现完全重复消息'}。</p>`;
}

function scoreCandidate(pattern, messages) {
  const evidence = messages.filter(message => pattern.words.some(word => message.text.includes(word)));
  const authors = new Set(evidence.map(item => item.author));
  const dated = new Set(evidence.filter(item => item.sentAt).map(item => item.sentAt.slice(0, 10)));
  const hasBusinessImpact = evidence.some(item => /(目标|上线|交付|客户|用户|收入|质量|成本|项目|风险)/.test(item.text));
  const hasCounterEvidence = messages.some(item => /(已解决|解决了|搞定了|没问题|不需要|偶发|一次性)/.test(item.text));
  const repeated = evidence.length >= 3 || dated.size >= 2;
  const diverse = authors.size >= 2 || dated.size >= 2;
  let status = 'observation';
  if (repeated && diverse && hasBusinessImpact && !hasCounterEvidence) status = 'action_ready_candidate';
  else if (evidence.length >= 2) status = 'hypothesis_needs_review';
  else if (evidence.length) status = 'observation';
  return { ...pattern, evidence, authors: authors.size, dates: dated.size, hasBusinessImpact, hasCounterEvidence, status };
}

function titleFor(candidate) {
  const suffix = candidate.status === 'action_ready_candidate' ? '候选缺口' : candidate.status === 'hypothesis_needs_review' ? '待复核观察' : '弱信号观察';
  return `${candidate.label} · ${suffix}`;
}

function statusLabel(status) {
  if (status === 'action_ready_candidate') return ['值得人工复核', 'ready'];
  if (status === 'hypothesis_needs_review') return ['仍需补充语境', 'review'];
  return ['证据尚弱', 'insufficient'];
}

function summaryFor(candidate) {
  if (candidate.modelSummary) return candidate.modelSummary;
  const base = `在导入记录中发现 ${candidate.evidence.length} 条与“${candidate.label}”相关的信号，涉及 ${candidate.authors} 位匿名参与者`;
  if (candidate.status === 'action_ready_candidate') return `${base}。它已达到初步的重复性与多样性门槛，值得由现场人员复核是否为系统性能力或协作问题。`;
  if (candidate.status === 'hypothesis_needs_review') return `${base}。存在可讨论的模式，但尚不能据此判断它是组织能力缺口还是具体项目中的局部事件。`;
  return `${base}。目前只是一条弱信号，不应生成行动建议。`;
}

function evidenceHtml(evidence) {
  return evidence.slice(0, 6).map(item => `<article class="evidence"><small>${item.author}${item.sentAt ? ` · ${item.sentAt}` : ' · 时间缺失'}</small><p>${escapeHtml(item.text)}</p></article>`).join('');
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));
}

function candidateHtml(candidate, index) {
  const [label, statusClass] = statusLabel(candidate.status);
  const actionHtml = candidate.status === 'action_ready_candidate'
    ? `<ul>${candidate.actions.map(action => `<li>${action}</li>`).join('')}</ul>`
    : `<p>先补充上下文或继续观察；此阶段不对 Recruit、Train、Outsource 等行动排序。</p>`;
  const counter = candidate.counterNarrative || (candidate.hasCounterEvidence
    ? '记录中也出现了“已解决/偶发”等可能反证；需要人工判断它是否仍是持续模式。'
    : '尚未发现明确反证，但“未出现反证”不等于已证实。');
  return `<article class="candidate">
    <div class="candidate-top"><div><h3>${titleFor(candidate)}</h3><p class="lens">观察 Lens：${candidate.lens}</p></div><span class="status ${statusClass}">${label}</span></div>
    <p class="candidate-summary">${summaryFor(candidate)}</p>
    <div class="candidate-grid">
      <div class="candidate-block"><h4>待确认的问题</h4><p>${candidate.question}</p></div>
      <div class="candidate-block warning"><h4>反证与边界</h4><p>${counter}</p></div>
      <div class="candidate-block"><h4>可能的下一步</h4>${actionHtml}</div>
      <div class="candidate-block warning"><h4>证据检查</h4><p>${candidate.evidence.length} 条相关消息 · ${candidate.authors} 位参与者 · ${candidate.dates} 个有时间标记的日期 · ${candidate.hasBusinessImpact ? '出现业务影响线索' : '尚未找到明确业务影响线索'}</p></div>
    </div>
    <button class="evidence-toggle" data-evidence="evidence-${index}">查看 ${Math.min(candidate.evidence.length, 6)} 条匿名化证据 ▾</button>
    <div id="evidence-${index}" class="evidence-list" hidden>${evidenceHtml(candidate.evidence)}</div>
  </article>`;
}

function renderRulePreview() {
  const candidates = PATTERNS.map(pattern => scoreCandidate(pattern, state.messages)).filter(candidate => candidate.evidence.length);
  const template = $('#resultTemplate');
  $('#results').replaceChildren(template.content.cloneNode(true));
  $('#candidateCount').textContent = candidates.length;
  const authors = new Set(state.messages.map(message => message.author)).size;
  const partial = state.messages.filter(message => message.completeness === 'partial').length;
  $('#analysisMeta').innerHTML = `<span class="metric"><strong>${state.messages.length}</strong> 条本地消息</span><span class="metric"><strong>${authors}</strong> 位匿名参与者</span><span class="metric"><strong>${partial}</strong> 条元数据不完整</span><span class="metric"><strong>${candidates.filter(c => c.status === 'action_ready_candidate').length}</strong> 项值得复核</span>`;
  const list = $('#candidateList');
  if (!candidates.length) {
    list.innerHTML = `<section class="candidate"><h3>证据不足，暂不形成候选缺口</h3><p class="candidate-summary">没有发现足以形成重复模式的通用协作摩擦信号。这不代表群里没有问题；也可能是时间窗过短、格式不完整，或现有词典尚未覆盖该领域。</p></section>`;
  } else list.innerHTML = candidates.sort((a, b) => b.evidence.length - a.evidence.length).map(candidateHtml).join('');
  document.querySelectorAll('.evidence-toggle').forEach(button => button.addEventListener('click', () => {
    const list = $(`#${button.dataset.evidence}`); const opening = list.hidden;
    list.hidden = !opening; button.textContent = `${opening ? '收起' : '查看'}匿名化证据 ${opening ? '▴' : '▾'}`;
  }));
  $('#downloadReviewButton').addEventListener('click', () => downloadReviewPacket(candidates));
  $('#importState').textContent = '分析完成';
  $('#importState').className = 'state-pill analyzed';
}

function providerSettings() {
  return {
    provider: $('#providerSelect').value,
    model: $('#modelName').value.trim(),
    endpoint: $('#endpoint').value.trim(),
    apiKey: $('#apiKey').value.trim()
  };
}

function configureProvider() {
  const gemini = $('#providerSelect').value === 'gemini';
  $('#modelName').value = gemini ? 'gemini-2.5-flash' : 'deepseek-chat';
  $('#endpoint').value = gemini ? 'https://generativelanguage.googleapis.com/v1beta/models' : 'https://api.deepseek.com/chat/completions';
  $('#modelNotice').textContent = gemini
    ? '将把脱敏文本发送至 Google Gemini。API Key 仅用于本次请求，不写入文件或浏览器存储。'
    : '适用于兼容 OpenAI Chat Completions 的服务。请填写该服务商提供的模型名与 API 地址；Key 仅用于本次请求。';
  readyToAnalyze();
}

function corePrompt() {
  const messages = state.messages.map(({ id, sequence, sentAt, author, text }) => ({ id, sequence, sentAt, author, text }));
  return `你是 Organization Capability Radar 的 Capability Orchestration Core。分析的是已授权且已脱敏的协作记录。目标不是总结聊天、更不是评价个人；请开放识别组织层面的能力、机制、资源或协作缺口，并对证据不足保持克制。\n\n必须遵守：\n1. 只引用输入中的 message id；不可虚构事实、角色、时间或证据。\n2. 单次抱怨或局部事故不能升级为组织结论。\n3. 每个候选必须说明反证/不确定性。\n4. 仅当有重复、跨角色/时点、且和业务影响相关的证据时，status 才可为 action_ready_candidate。\n5. actionPortfolio 只能建议，不可自动决定；action 只能是 Recruit、Internal Mobility、Train、Outsource / External Flexible、AI Enablement、Mechanism First 之一。\n\n只返回有效 JSON，结构如下：\n{ "candidates": [{"title":"", "lens":"capability_supply|operating_mechanism|resource_allocation|decision_or_information_interface|local_delivery_issue", "status":"action_ready_candidate|hypothesis_needs_review|observation", "observation":"中性描述", "question":"需要现场确认的问题", "evidenceIds":["m-1"], "counterNarrative":"反证或不确定性", "actionPortfolio":[{"action":"Mechanism First", "priority":"now|next|conditional", "rationale":"", "firstMove":"", "guardrail":""}]}], "overallCaution":"" }\n\n已脱敏记录：\n${JSON.stringify(messages)}`;
}

function parseModelJson(text) {
  const cleaned = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed.candidates)) throw new Error('模型返回的内容不符合 Core 输出结构。请重试或更换模型。');
  return parsed;
}

async function callModel(settings, prompt) {
  if (settings.provider === 'gemini') {
    const endpoint = `${settings.endpoint.replace(/\/$/, '')}/${encodeURIComponent(settings.model)}:generateContent`;
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': settings.apiKey }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, responseMimeType: 'application/json' } }) });
    if (!response.ok) throw new Error(`Gemini 请求失败（${response.status}）。请检查 Key、模型名、权限和网络。`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
  }
  const response = await fetch(settings.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` }, body: JSON.stringify({ model: settings.model, temperature: 0.2, messages: [{ role: 'system', content: 'Return only valid JSON. Follow the supplied Core contract exactly.' }, { role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error(`模型请求失败（${response.status}）。请检查 API 地址、Key、模型名、权限和网络。`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function normalizeModelCandidate(item) {
  const evidenceById = new Map(state.messages.map(message => [message.id, message]));
  const evidence = (item.evidenceIds || []).map(id => evidenceById.get(id)).filter(Boolean).slice(0, 6);
  const actionText = (item.actionPortfolio || []).map(row => `${row.action}（${row.priority || 'conditional'}）：${row.firstMove || row.rationale || '待现场确认'}`);
  return {
    label: baseText(item.title) || '未命名候选', lens: baseText(item.lens) || 'insufficient_evidence',
    status: ['action_ready_candidate', 'hypothesis_needs_review', 'observation'].includes(item.status) ? item.status : 'hypothesis_needs_review',
    modelSummary: baseText(item.observation), question: baseText(item.question) || '这项判断是否符合现场实际？',
    counterNarrative: baseText(item.counterNarrative), actions: actionText, evidence,
    authors: new Set(evidence.map(message => message.author)).size,
    dates: new Set(evidence.filter(message => message.sentAt).map(message => message.sentAt.slice(0, 10))).size,
    hasBusinessImpact: true, hasCounterEvidence: Boolean(item.counterNarrative)
  };
}

async function analyze() {
  const settings = providerSettings();
  $('#analyzeButton').disabled = true; $('#analyzeButton').textContent = '正在调用已选择的模型…'; $('#importError').hidden = true;
  try {
    const output = parseModelJson(await callModel(settings, corePrompt()));
    const candidates = output.candidates.map(normalizeModelCandidate).filter(candidate => candidate.evidence.length);
    const template = $('#resultTemplate'); $('#results').replaceChildren(template.content.cloneNode(true));
    $('#candidateCount').textContent = candidates.length;
    const authors = new Set(state.messages.map(message => message.author)).size;
    $('#analysisMeta').innerHTML = `<span class="metric"><strong>${state.messages.length}</strong> 条已脱敏消息</span><span class="metric"><strong>${authors}</strong> 位匿名参与者</span><span class="metric"><strong>${candidates.filter(candidate => candidate.status === 'action_ready_candidate').length}</strong> 项值得复核</span>`;
    $('#candidateList').innerHTML = candidates.length ? candidates.map(candidateHtml).join('') : `<section class="candidate"><h3>证据不足，暂不形成候选缺口</h3><p class="candidate-summary">${escapeHtml(output.overallCaution || '模型未找到符合证据门槛的候选项。')}</p></section>`;
    document.querySelectorAll('.evidence-toggle').forEach(button => button.addEventListener('click', () => { const list = $(`#${button.dataset.evidence}`); list.hidden = !list.hidden; }));
    $('#downloadReviewButton').addEventListener('click', () => downloadReviewPacket(candidates));
    $('#importState').textContent = '模型分析完成'; $('#importState').className = 'state-pill analyzed';
  } catch (error) {
    $('#importError').textContent = error.message || '模型分析失败。'; $('#importError').hidden = false;
  } finally { $('#analyzeButton').textContent = '调用模型进行开放探索'; readyToAnalyze(); }
}

function downloadReviewPacket(candidates) {
  const payload = {
    notice: '本地人工复核包：不含原始文件名、真实发言人或未脱敏原文。请勿将其用于自动人事或组织决定。',
    generatedAt: new Date().toISOString(),
    dataQuality: {
      messageCount: state.messages.length,
      anonymousParticipants: new Set(state.messages.map(message => message.author)).size,
      recordsWithIncompleteMetadata: state.messages.filter(message => message.completeness === 'partial').length
    },
    candidates: candidates.map(candidate => ({
      title: titleFor(candidate),
      lens: candidate.lens,
      status: candidate.status,
      questionForReview: candidate.question,
      suggestedNextSteps: candidate.status === 'action_ready_candidate' ? candidate.actions : [],
      evidence: candidate.evidence.slice(0, 6).map(({ sequence, sentAt, author, text }) => ({ sequence, sentAt, author, text })),
      reviewerFeedback: {
        accuracy: '', evidenceSufficiency: '', scope: '', preferredAction: '', missingContext: ''
      }
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = 'capability-radar-review-packet.json';
  document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

function reset() {
  state.file = null; state.rawMessages = []; state.messages = []; state.aliases = new Map(); state.redaction = null;
  $('#fileInput').value = ''; $('#confirmAuthorization').checked = false; $('#confirmAnonymization').checked = false; $('#confirmRedactionReview').checked = false; $('#customTerms').value = '';
  $('#apiKey').value = ''; $('#confirmExternalSend').checked = false;
  $('#redactionWorkbench').hidden = true;
  $('#dataQuality').hidden = true; $('#dataQuality').innerHTML = '';
  $('#importSummary').className = 'summary empty'; $('#importSummary').textContent = '尚未读取任何文件。';
  $('#importState').textContent = '等待文件'; $('#importState').className = 'state-pill';
  $('#analyzeButton').disabled = true; $('#clearButton').disabled = true; $('#importError').hidden = true;
  $('#results').innerHTML = `<div class="empty-results panel"><p class="eyebrow">STEP 02</p><h2>先导入，再探索</h2><p>分析器不会预设“缺哪一种人”。它会先寻找反复出现的阻塞、资源冲突、接口断裂、能力供给不足和机制缺口；证据不足时，会明确说“尚不能判断”。</p></div>`;
}

function readyToAnalyze() {
  const api = providerSettings();
  $('#analyzeButton').disabled = !(state.messages.length && $('#confirmAuthorization').checked && $('#confirmAnonymization').checked && $('#confirmRedactionReview').checked && $('#confirmExternalSend').checked && api.model && api.endpoint && api.apiKey);
}

$('#fileInput').addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  reset(); state.file = file;
  try {
    const text = await file.text();
    const isJson = file.name.toLowerCase().endsWith('.json') || file.type === 'application/json';
    state.rawMessages = isJson ? parseJson(text) : parseMarkdown(text);
    if (!state.rawMessages.length) throw new Error('没有读到有效消息。');
    rebuildRedactedMessages();
    displaySummary(); $('#clearButton').disabled = false; readyToAnalyze();
  } catch (error) {
    state.file = null; state.rawMessages = []; state.messages = [];
    $('#importError').textContent = error.message || '文件读取失败。'; $('#importError').hidden = false;
    $('#importState').textContent = '无法读取'; $('#importState').className = 'state-pill'; $('#clearButton').disabled = false;
  }
});

$('#confirmAuthorization').addEventListener('change', readyToAnalyze);
$('#confirmAnonymization').addEventListener('change', readyToAnalyze);
$('#confirmRedactionReview').addEventListener('change', readyToAnalyze);
$('#confirmExternalSend').addEventListener('change', readyToAnalyze);
$('#apiKey').addEventListener('input', readyToAnalyze);
$('#modelName').addEventListener('input', readyToAnalyze);
$('#endpoint').addEventListener('input', readyToAnalyze);
$('#providerSelect').addEventListener('change', configureProvider);
$('#applyRedactionButton').addEventListener('click', () => { rebuildRedactedMessages(); $('#confirmRedactionReview').checked = false; readyToAnalyze(); });
$('#downloadRedactedButton').addEventListener('click', downloadRedactedCopy);
$('#analyzeButton').addEventListener('click', analyze);
$('#clearButton').addEventListener('click', reset);

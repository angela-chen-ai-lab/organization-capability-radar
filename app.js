const messages = [
  ['D1','IP「星际小队」协同群','IP 运营负责人','IP','下季度要同步推毛绒、公仔、互动电动玩具和卡牌。不是把四个 SKU 放在一起卖，是让用户觉得它们属于同一个世界。'],
  ['D1','电动玩具项目群','产品负责人','产品','互动玩法今天得锁，不然结构、电子和 App 端都没法往下排。公仔组那边的主角色设定定了吗？'],
  ['D1','毛绒公仔项目群','设计负责人','产品','还在改。上周说主角是“飞行形态”，今天 IP 说要保留四足比例；我们已经按前一版开了外观样。'],
  ['D1','电动玩具项目群','结构工程师','工程','外观没冻结，我连电池仓位置都不敢定。后面再改，不是改一张图，是模具、配重、跌落测试全要重来。'],
  ['D1','电动玩具项目群','产品负责人','产品','我理解，但市场窗口不等人。能不能先按飞行形态出一个可玩的版本？'],
  ['D1','电动玩具项目群','嵌入式工程师','工程','可以做，但要先有人把动作、灯效、传感器和 App 交互串起来。现在不是“写一段程序”就完了。'],
  ['D2','研发资源群','电动玩具项目经理','产品','@毛绒公仔项目经理 能不能把阿凯借我三天？他之前做过带灯效的互动件，至少知道结构留什么位置。'],
  ['D2','研发资源群','毛绒公仔项目经理','产品','借不了，他正在跟供应商处理颈部转轴断裂。我们也在赶样，借走就没人盯。'],
  ['D2','研发资源群','技术负责人','技术','阿凯不是共享资源吗？为什么每次借人都要两个项目经理各自谈？本周已经是第三次。'],
  ['D2','研发资源群','电动玩具项目经理','产品','因为他劳动关系和绩效都在毛绒组，我借到了也不知道谁给他排优先级。'],
  ['D2','研发资源群','HRBP','HR','你们上个月提的三个需求，一个叫“硬件工程师”，一个叫“互动玩具研发”，一个叫“软硬件全栈”。到底是不是同一类人？'],
  ['D2','研发资源群','技术负责人','技术','有重叠，但不能完全合并。我们要的不是单点深度特别高的人，是能看懂结构限制、电子方案和软件联调，还能在不同产品间快速换题的人。'],
  ['D3','电动玩具项目群','产品负责人','产品','现在卡在哪里，给我一句能拿去汇报的话。'],
  ['D3','电动玩具项目群','嵌入式工程师','工程','卡在系统集成。结构刚变，传感器位置要重选；电路改完还要重新调动作逻辑。每一段都有同事，但没人能从整机把这几段串起来。'],
  ['D3','电动玩具项目群','产品负责人','产品','那就拆开做，结构先出、软件后补。'],
  ['D3','电动玩具项目群','嵌入式工程师','工程','拆开以后就是现在这个局面：样机能亮、能动，但动作和外观冲突；最后还是在联调时一起返工。'],
  ['D3','电动玩具项目群','技术负责人','技术','今晚先别全员加班。加班能多做零件，不能替代系统方案。请明早之前把接口和变更影响列出来。'],
  ['D3','研发资源群','电动玩具项目经理','产品','小何说他连续两周在救火，自己也扛不住：结构问题要他看，蓝牙连不上也找他，产品改玩法还是找他。'],
  ['D4','卡牌项目群','内容主策','IP','公仔文件是世界观 v4，卡牌还在用 v3。主角和反派的关系不一样，12 张牌要重画。谁是这套设定的最终版本负责人？'],
  ['D4','IP「星际小队」协同群','IP 运营负责人','IP','目前没有单独的版本 Owner。每个品类都是跟各自产品负责人确认，再来找我补。'],
  ['D4','IP「星际小队」协同群','毛绒公仔项目经理','产品','我们不是不愿意配合，但我团队 KPI 是公仔按期上市；电动玩具要等三轮联调，不能一直占我们的设计资源。'],
  ['D4','IP「星际小队」协同群','电动玩具项目经理','产品','反过来也一样。我们为了等外观冻结已经空转四天，研发排期里没有“等其他品类确认”这个工时。'],
  ['D5','招聘协同群','HRBP','HR','我跟了 14 个候选人：做消费电子的，软硬件深度够但对非标准玩具和内容 IP 兴趣不大；做玩具的，多数偏结构或供应链，互动软件经验不够。'],
  ['D5','招聘协同群','技术负责人','技术','市场上没有我们 JD 写的“拿来就能用的人”。但别因为难就把画像写成“会 C、会结构、会电路、会 App、还能带项目”，这样一个也进不了面。'],
  ['D5','招聘协同群','HRBP','HR','那我怎么筛？现在三个项目经理给我的必备项加起来有 19 条，候选人每少一条就被否。'],
  ['D5','招聘协同群','技术负责人','技术','分层：基础是系统思维和其中一到两个硬技能；其余用项目经历、学习速度和搭档机制来补。我们招的是可迁移的人，不是四个岗位叠在一个人身上。'],
  ['D5','招聘协同群','业务负责人','IP','这个岗位即使招到，也不能只放电动玩具组。下个 IP 做卡牌互动或桌面机器人，能力又被锁死了。'],
  ['D6','研发资源群','毛绒公仔项目经理','产品','阿凯这周 60% 在我们组、40% 支援电动玩具，结果两个项目都说他响应慢。能不能明确一个统一的资源优先级？'],
  ['D6','研发资源群','技术负责人','技术','现在没有能跨项目排优先级的人。每个项目都按自己的交付期最急，这不是谁态度不好。'],
  ['D6','研发资源群','初级研发工程师','工程','我能不能跟阿凯一起做一次完整联调？我会画板子，但每次到结构改动、固件和测试怎么接，我就不知道从哪问。'],
  ['D6','研发资源群','技术负责人','技术','可以。但不能靠师傅带徒弟式的碰运气。我们得把整机评审、接口清单和复盘做成固定机制。'],
  ['D7','管理群','业务负责人','IP','这周我同时收到“缺人”“借人”“要加班”“版本冲突”四类问题。它们是不是同一个问题？请不要给我四张独立工单。'],
  ['D7','管理群','HRBP','HR','我需要一个能落地的画像：到底要招几类研发、哪些必须有、哪些可以培养？现在三个部门给的要求互相叠加，我没法判断。'],
  ['D7','管理群','技术负责人','技术','我也需要明确：新招的人是补给哪个项目，还是要在项目之间流动？如果还是各组临时抢人，招到的人很快又会变成下一个救火点。'],
  ['D7','管理群','IP 运营负责人','IP','同一个 IP 的版本、节奏和资源优先级，现在到底谁负责？没有这个答案，后面每个品类都会继续按自己的最急来排。']
].map(([day, channel, author, role, text], index) => ({ id: `m${index + 1}`, day, channel, author, role, text, index }));

const $ = (s) => document.querySelector(s);
let observed = 0;
let timer = null;

function avatarClass(role) { return { IP: 'ip', 产品: 'product', 技术: 'tech', HR: 'hr', 工程: 'engineer' }[role] || 'tech'; }
function avatarText(author) { return author.slice(0, 1); }
function visibleSignals() {
  const all = [
    [1, 'business_goal', '跨品类 IP 体验', '同一 IP 同期进入多个产品形态'],
    [3, 'delivery_blocker', '需求变更影响整机', '外观变更已影响电池仓、模具与测试'],
    [5, 'missing_skill', '跨域产品工程', '需要串起动作、灯效、传感器与 App 交互'],
    [8, 'capacity_conflict', '共享资源调度', '同一关键人员被多个项目争抢'],
    [13, 'delivery_blocker', '系统集成缺口', '模块存在，但没有人对整机接口负责'],
    [17, 'key_person_risk', '单点依赖', '小何被多类问题反复拉去救火'],
    [19, 'operating_model', 'IP 资产治理缺口', '同一 IP 的版本没有最终 Owner'],
    [22, 'talent_supply_gap', '非标准研发供给不足', '市场没有“即插即用”的全能候选人'],
    [24, 'overconstrained_profile', '人才画像失真', '19 条必备项叠成不可能的岗位'],
    [27, 'resource_lock_in', '能力被部门锁定', '人员绩效归属导致共享失灵'],
    [30, 'learning_path_gap', '成长机制缺失', '初级工程师没有完整联调的成长路径'],
    [35, 'systemic_confirmation', '系统性问题确认', '管理层提出缺人、借人、返工与版本冲突的关联问题']
  ];
  return all.filter(([at]) => at < observed).map(([at, type, name, detail]) => ({ at, type, name, detail }));
}
function gaps() {
  if (observed < 6) return [];
  const result = [{ id:'engineering', name:'跨域产品工程能力供给', priority: observed >= 25 ? 'high' : 'medium', confidence: Math.min(91, 38 + observed * 2), impact:'互动产品交付与整机质量', phase: 'talent' }];
  if (observed >= 19) result.push({ id:'orchestration', name:'IP 生命周期经营与跨品类协同', priority: observed >= 31 ? 'high' : 'medium', confidence: Math.min(94, 36 + observed * 2), impact:'IP 变现速度与体验一致性', phase:'system' });
  return result;
}
function analysisReady() { return observed >= 31; }
function renderConversation() {
  const el = $('#conversation'); let lastDay = '';
  el.innerHTML = messages.map((m) => {
    const divider = m.day !== lastDay ? `<div class="day-divider">${(lastDay = m.day)} · 项目现场</div>` : '';
    const active = m.index < observed;
    return `${divider}<article class="message ${active ? 'visible' : ''}" id="${m.id}"><div class="avatar ${avatarClass(m.role)}">${avatarText(m.author)}</div><div><div class="message-meta"><span class="message-author">${m.author}</span><span class="message-channel">${m.channel}</span></div><div class="message-text">${m.text}</div></div></article>`;
  }).join('');
  if (observed) document.querySelector(`#m${observed}`)?.scrollIntoView({ behavior:'smooth', block:'nearest' });
}
function renderSignals() {
  const signals = visibleSignals(); $('#signalCount').textContent = signals.length;
  $('#signals').className = signals.length ? '' : 'signals-empty';
  $('#signals').innerHTML = signals.length ? signals.slice(-4).reverse().map(s => `<div class="signal"><i></i><div><strong>${s.name}</strong><p>${s.detail}</p></div></div>`).join('') : '播放对话后，Agent 会提取业务信号。';
}
function renderGaps() {
  const items = gaps(); $('#gapCount').textContent = items.length;
  $('#gaps').className = items.length ? '' : 'gaps-empty';
  $('#gaps').innerHTML = items.length ? items.map(g => `<button class="gap-card" data-gap="${g.id}"><div class="gap-top"><span class="gap-name">${g.name}</span><span class="priority ${g.priority}">${g.priority.toUpperCase()}</span></div><div class="gap-meta"><span>Confidence ${g.confidence}%</span><span>${g.impact}</span></div><div class="confidence-bar"><b style="width:${g.confidence}%"></b></div></button>`).join('') : '尚未形成能力缺口。';
  document.querySelectorAll('.gap-card').forEach(b => b.addEventListener('click', () => openDrawer(b.dataset.gap)));
}
function renderActions() {
  const ready = analysisReady();
  $('#actions').className = ready ? '' : 'actions-empty';
  $('#actions').innerHTML = ready ? `<div class="action-combo"><h4>稳定核心 + 灵活供给</h4><p>Agent 建议并行解决：建立 IP 级协同机制，同时补足可跨品类迁移的研发能力。</p><div class="action-tags"><span>Recruit</span><span>Internal mobility</span><span>Train</span><span>External flexible</span><span>AI enablement</span></div></div>` : '需要更多跨群证据后才会生成建议。';
}
function update() {
  renderConversation(); renderSignals(); renderGaps(); renderActions();
  $('#progressLabel').textContent = `${observed} / ${messages.length} signals observed`;
  $('#liveLabel').textContent = observed ? (observed === messages.length ? 'Scenario complete' : 'Observing live signals') : 'Waiting for signals';
  $('.live-status').classList.toggle('active', Boolean(observed));
  $('#radarState').textContent = analysisReady() ? 'Systemic gap detected' : observed ? 'Learning' : 'Observing';
  $('#radarState').classList.toggle('active', analysisReady());
  $('#playButton').textContent = timer ? '❚❚ Pause scenario' : (observed === messages.length ? '↻ Replay scenario' : '▶ Play scenario');
}
function step() { if (observed < messages.length) { observed += 1; update(); } else { stop(); } }
function stop() { if (timer) clearInterval(timer); timer = null; update(); }
function play() { if (timer) return stop(); if (observed === messages.length) observed = 0; step(); timer = setInterval(() => { if (observed >= messages.length) stop(); else step(); }, 1050); update(); }
function evidence(ids) {
  return ids
    .map(i => messages[i - 1])
    .filter(Boolean)
    .map(m => `<div class="evidence"><small>${m.day} · ${m.channel} · ${m.author}</small><p>${m.text}</p></div>`)
    .join('');
}
function openDrawer(id) {
  const systemic = id === 'orchestration';
  $('#drawerTitle').textContent = systemic ? 'IP 生命周期经营与跨品类协同' : '跨域产品工程能力供给';
  $('#drawerBody').innerHTML = systemic ? `
    <div class="agent-insight"><strong>Agent synthesis</strong><p>这是系统性能力缺口：同一 IP 的商业目标要求跨品类协同，但版本治理、资源优先级与部门边界仍按孤立产品运作。</p></div>
    <h3>Why this is not one meeting</h3><p>证据跨越 IP、公仔、卡牌、电动玩具与研发资源群。单次协调会不能解决共同资产 Owner、节奏和共享资源优先级的缺失。</p>
    <h3>Evidence across boundaries</h3>${evidence([19,20,21,22,28,29,35])}
    <h3>Suggested organization action</h3><ul><li>为重点 IP 设定资产/版本 Owner 与共同里程碑。</li><li>建立跨品类虚拟团队与统一的资源优先级。</li><li>将跨域研发纳入共享能力池，而非永久锁在单一品类。</li></ul>
    <p><span class="agent-tag">HUMAN CONFIRMATION REQUIRED</span></p>` : `
    <div class="agent-insight"><strong>Agent synthesis</strong><p>这不是“找一个全能人”能解决的问题。组织缺少可跨非标准产品迁移、把结构、电子、软件与测试串成完整闭环的稳定研发供给。</p></div>
    <h3>Evidence</h3>${evidence([6,12,14,16,18,23,24,25,26,30,31,33,34,35])}
    <h3>Recruiting capability brief — draft</h3><p><strong>能力单元：</strong>跨域产品工程研发（Interactive Product Engineer）</p><ul><li><strong>Must-have：</strong>一个专业锚点（结构/电子/嵌入式之一）+ 至少一个完整实体产品闭环经验。</li><li><strong>Strong preference：</strong>能解释需求变更如何影响跨专业接口，并展示一次失败后的定位与取舍。</li><li><strong>不要设为硬门槛：</strong>同时精通所有专业、完全相同玩具品类、到岗即独立覆盖全链路。</li><li><strong>验证：</strong>脱敏作品档案 + 允许使用 AI 的工作样本 + 复盘访谈。</li></ul>
    <h3>Development plan</h3><p>将 Level 2/3 内部人员置入真实子系统集成任务，与 Level 4 导师配对；以接口评审、变更复盘、样机验收作为晋级闸门。</p>
    <p><span class="agent-tag">HRBP + TECH LEAD CONFIRMATION REQUIRED</span></p>`;
  $('#detailDrawer').classList.add('open'); $('#scrim').classList.add('open');
}
function closeDrawer() { $('#detailDrawer').classList.remove('open'); $('#scrim').classList.remove('open'); }
$('#playButton').addEventListener('click', play); $('#stepButton').addEventListener('click', () => { stop(); step(); });
$('#resetButton').addEventListener('click', () => { stop(); observed = 0; update(); }); $('#closeDrawer').addEventListener('click', closeDrawer); $('#scrim').addEventListener('click', closeDrawer);
update();

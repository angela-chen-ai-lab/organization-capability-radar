export function helpCard() {
  return { msg_type: 'interactive', card: { config: { wide_screen_mode: true }, header: { title: { tag: 'plain_text', content: '组织能力雷达 · 使用边界' } }, elements: [{ tag: 'markdown', content: '我只在群成员主动触发后创建分析草案。\n\n可用命令：\n- `@能力雷达 分析本线程`\n- `@能力雷达 分析最近 20 条`\n- `@能力雷达 帮助`\n\n我不会自动作出招聘、调动或绩效决定。' }] } };
}

export function pendingAnalysisCard(request) {
  const scope = request.requestedScope.type === 'recent_messages' ? `最近 ${request.requestedScope.limit} 条消息` : '当前线程（待确认可读取范围）';
  return { msg_type: 'interactive', card: { config: { wide_screen_mode: true }, header: { title: { tag: 'plain_text', content: '组织能力雷达 · 待确认分析' } }, elements: [{ tag: 'markdown', content: `**请求范围：** ${scope}\n\n下一步将先把飞书消息正规化并进行脱敏；任何模型分析都必须基于已授权范围和人工确认。\n\n当前骨架不会读取额外历史消息，也不会发送数据到模型。` }] } };
}

export function analysisResultCard(result) {
  const body = result.candidates.length
    ? result.candidates.map((item, index) => `${index + 1}. **${item.title}**\n${item.observation}\n建议：${(item.actionPortfolio || []).map(action => action.action).join(' / ') || '先补充语境'}`).join('\n\n')
    : `暂未形成候选缺口。${result.overallCaution}`;
  return { msg_type: 'interactive', card: { config: { wide_screen_mode: true }, header: { title: { tag: 'plain_text', content: '组织能力雷达 · 分析草案' } }, elements: [{ tag: 'markdown', content: `${body}\n\n---\n${result.redactionNotice}\n这不是自动决策，请由熟悉现场的人员复核。` }] } };
}

export function buildCorePrompt(messages) {
  return `你是 Organization Capability Radar 的 Capability Orchestration Core。以下是已授权、已脱敏的飞书消息。请识别组织层面的能力、机制、资源或协作缺口；不要评价个人。只引用存在的消息 id，不得虚构事实。\n\n输出 JSON：{ "candidates": [{ "title":"", "lens":"capability_supply|operating_mechanism|resource_allocation|decision_or_information_interface|local_delivery_issue", "status":"action_ready_candidate|hypothesis_needs_review|observation", "observation":"", "evidenceIds":[""], "counterNarrative":"", "actionPortfolio":[{"action":"Recruit|Internal Mobility|Train|Outsource / External Flexible|AI Enablement|Mechanism First", "priority":"now|next|conditional", "firstMove":"", "guardrail":""}] }], "overallCaution":"" }\n\n消息：${JSON.stringify(messages)}`;
}

export function validateCoreResult(result, messages) {
  const messageIds = new Set(messages.map(message => message.id));
  const candidates = Array.isArray(result?.candidates) ? result.candidates : [];
  return {
    candidates: candidates.map(candidate => ({
      ...candidate,
      evidenceIds: (candidate.evidenceIds || []).filter(id => messageIds.has(id)).slice(0, 6)
    })).filter(candidate => candidate.evidenceIds.length),
    overallCaution: String(result?.overallCaution || '请由熟悉现场的人员核对这份建议草案。')
  };
}

export function parseCommand(text = '') {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (/帮助|help/i.test(normalized)) return { kind: 'help' };
  if (/分析本线程/.test(normalized)) return { kind: 'analyze_thread' };
  const match = normalized.match(/分析最近\s*(\d{1,3})\s*条/);
  if (match) return { kind: 'analyze_recent', limit: Math.min(Number(match[1]), 50) };
  return { kind: 'unknown' };
}

export function toCanonicalMessage(event = {}) {
  const message = event.message || {};
  const senderId = event.sender?.sender_id?.open_id || event.sender?.sender_id?.user_id || message.sender_id || 'unknown';
  let content = message.content || '';
  try { content = JSON.parse(content).text || content; } catch { /* plain text remains valid */ }
  return {
    id: message.message_id || `feishu-${Date.now()}`,
    sequence: 1,
    sentAt: message.create_time ? new Date(Number(message.create_time) * 1000).toISOString() : undefined,
    author: { alias: String(senderId), roleHint: 'unknown' },
    text: String(content).trim(),
    metadataCompleteness: message.create_time ? 'partial' : 'partial'
  };
}

export function createAnalysisRequest(event, command) {
  return {
    source: 'feishu',
    trigger: 'user_command',
    requestedScope: command.kind === 'analyze_recent' ? { type: 'recent_messages', limit: command.limit } : { type: 'thread_only' },
    triggerMessage: toCanonicalMessage(event),
    safeguards: ['explicit_user_trigger', 'minimum_scope', 'no_automatic_hr_decision', 'human_confirmation_required']
  };
}

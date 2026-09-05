import { redactConversation } from './redaction.js';
import { buildCorePrompt, validateCoreResult } from './core.js';

export async function runConfirmedAnalysis({ messages, customTerms = [], modelClient }) {
  if (!Array.isArray(messages) || !messages.length) throw new Error('没有可分析的、已明确授权的消息。');
  if (typeof modelClient !== 'function') throw new Error('尚未配置模型 Adapter；不会把消息发送到任何外部服务。');
  const redacted = redactConversation(messages, customTerms);
  const rawResult = await modelClient({ prompt: buildCorePrompt(redacted.messages), messages: redacted.messages });
  return { ...validateCoreResult(rawResult, redacted.messages), redactionNotice: redacted.redactionNotice };
}

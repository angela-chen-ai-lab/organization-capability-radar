const replacements = [
  [/https?:\/\/\S+/gi, '[链接已隐藏]'],
  [/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[邮箱已隐藏]'],
  [/(?<!\d)1\d{10}(?!\d)/g, '[手机号已隐藏]'],
  [/(?<!\d)\d{15,19}(?!\d)/g, '[号码已隐藏]']
];

export function redactConversation(messages = [], customTerms = []) {
  const aliases = new Map();
  const aliasFor = value => {
    const key = String(value || 'unknown');
    if (!aliases.has(key)) aliases.set(key, `participant-${String(aliases.size + 1).padStart(2, '0')}`);
    return aliases.get(key);
  };
  const sanitized = messages.map(message => {
    let text = String(message.text || '');
    replacements.forEach(([pattern, replacement]) => { text = text.replace(pattern, replacement); });
    customTerms.filter(Boolean).sort((a, b) => b.length - a.length).forEach((term, index) => {
      const escaped = String(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      text = text.replace(new RegExp(escaped, 'g'), `[敏感词-${String(index + 1).padStart(2, '0')}]`);
    });
    return { ...message, author: { ...message.author, alias: aliasFor(message.author?.alias) }, text };
  });
  return { messages: sanitized, redactionNotice: '自动脱敏仅是第一层保护；分析前仍应由被授权者人工复核。' };
}

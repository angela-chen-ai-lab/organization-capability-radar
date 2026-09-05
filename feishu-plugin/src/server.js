import http from 'node:http';
import { createAnalysisRequest, parseCommand } from './adapter.js';
import { helpCard, pendingAnalysisCard } from './card.js';

const port = Number(process.env.PORT || 3000);

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

http.createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/feishu/events') return sendJson(response, 404, { error: 'Not found' });
  let raw = '';
  request.on('data', chunk => { raw += chunk; });
  request.on('end', () => {
    let body;
    try { body = JSON.parse(raw); } catch { return sendJson(response, 400, { error: 'Invalid JSON' }); }
    if (body.type === 'url_verification') return sendJson(response, 200, { challenge: body.challenge });
    const event = body.event || {};
    if (body.header?.event_type !== 'im.message.receive_v1') return sendJson(response, 200, { ok: true });
    const command = parseCommand(event.message?.content || '');
    const card = command.kind === 'help' ? helpCard() : command.kind === 'unknown' ? helpCard() : pendingAnalysisCard(createAnalysisRequest(event, command));
    console.log(JSON.stringify({ event: 'command_received', command: command.kind, card }, null, 2));
    return sendJson(response, 200, { ok: true });
  });
}).listen(port, () => console.log(`Feishu plugin skeleton listening on http://localhost:${port}/feishu/events`));

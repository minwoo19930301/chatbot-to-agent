import http from 'node:http';
import { readFile, stat, mkdir, writeFile, open, unlink, realpath } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(import.meta.url);
const root = resolve(dirname(script), '..');
const port = Number(process.env.DECK_PORT || 8767);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('DECK_PORT must be 1024–65535');
const origin = `http://127.0.0.1:${port}`;
const stateDir = resolve(root, '.local-server');
const pidFile = resolve(stateDir, 'server.json');
async function status() {
  try {
    const response = await fetch(`${origin}/__deck_health`, { signal: AbortSignal.timeout(800) });
    const value = await response.json();
    return value.project === root && value.port === port ? value : null;
  } catch { return null; }
}
if (process.argv.includes('--status')) {
  const live = await status();
  console.log(JSON.stringify({ running: !!live, url: origin + '/', pid: live?.pid || null }));
  process.exit(live ? 0 : 1);
}
if (process.argv.includes('--stop')) {
  const live = await status();
  const saved = await readFile(pidFile, 'utf8').then(JSON.parse).catch(() => null);
  if (live && saved?.pid === live.pid) process.kill(live.pid, 'SIGTERM');
  console.log(live ? 'Stopped this deck server.' : 'This deck server is not running.');
  process.exit(0);
}
if (process.argv.includes('--start')) {
  const live = await status();
  if (live) { console.log(origin + '/'); process.exit(0); }
  await mkdir(stateDir, { recursive: true });
  const log = await open(resolve(stateDir, 'server.log'), 'a');
  const child = spawn(process.execPath, [script], { cwd: root, detached: true, stdio: ['ignore', log.fd, log.fd], env: process.env });
  child.unref();
  await log.close();
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 100));
    if (await status()) { console.log(origin + '/'); process.exit(0); }
  }
  throw new Error('Deck server did not start. See .local-server/server.log; choose an unused DECK_PORT if needed.');
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, origin).pathname);
    if (pathname === '/__deck_health') {
      response.writeHead(200, { 'Content-Type': types['.json'], 'Cache-Control': 'no-store' });
      response.end(JSON.stringify({ project: root, pid: process.pid, port })); return;
    }
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside project');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    file = await realpath(file);
    if (!file.startsWith(root + sep)) throw new Error('Outside project');
    const info = await stat(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') response.end(); else createReadStream(file).pipe(response);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', async () => {
  await mkdir(stateDir, { recursive: true });
  await writeFile(pidFile, JSON.stringify({ pid: process.pid, port }));
  console.log(origin + '/');
});
process.on('SIGTERM', () => server.close(async () => { await unlink(pidFile).catch(() => {}); process.exit(0); }));

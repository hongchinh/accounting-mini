#!/usr/bin/env node
/**
 * Brainstorm Visual Companion Server
 * Watches content/ for new HTML files, serves newest to browser, records click events.
 *
 * Usage:
 *   node scripts/brainstorm-server.js [--project-dir <path>] [--host <host>] [--url-host <host>]
 *
 * Output (JSON, stdout):
 *   {"type":"server-started","port":52341,"url":"http://localhost:52341",
 *    "screen_dir":"...","state_dir":"...","session_dir":"..."}
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── Arg parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let projectDir = null;
let host = 'localhost';
let urlHost = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project-dir' && args[i + 1]) projectDir = args[++i];
  if (args[i] === '--host' && args[i + 1]) host = args[++i];
  if (args[i] === '--url-host' && args[i + 1]) urlHost = args[++i];
}

if (!urlHost) urlHost = (host === '0.0.0.0') ? 'localhost' : host;

// ── Session directory setup ──────────────────────────────────────────────────

const baseDir = projectDir
  ? path.join(projectDir, '.superpowers', 'brainstorm')
  : path.join(os.tmpdir(), 'brainstorm');

const sessionId = `${process.pid}-${Date.now()}`;
const sessionDir = path.join(baseDir, sessionId);
const screenDir = path.join(sessionDir, 'content');
const stateDir  = path.join(sessionDir, 'state');

fs.mkdirSync(screenDir, { recursive: true });
fs.mkdirSync(stateDir,  { recursive: true });

// ── Template loading ─────────────────────────────────────────────────────────

const scriptsDir   = __dirname;
const framePath    = path.join(scriptsDir, 'frame-template.html');
const helperPath   = path.join(scriptsDir, 'helper.js');
const frameTemplate = fs.readFileSync(framePath, 'utf8');
const helperScript  = fs.readFileSync(helperPath, 'utf8');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNewestFile(dir) {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    if (!files.length) return null;
    return files
      .map(f => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime)[0].name;
  } catch {
    return null;
  }
}

function buildPage(htmlFile) {
  const raw = fs.readFileSync(path.join(screenDir, htmlFile), 'utf8');
  const trimmed = raw.trimStart();
  const isFullDoc = trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html');

  if (isFullDoc) {
    const tag = `<script>\n${helperScript}\n</script>`;
    return raw.includes('</body>')
      ? raw.replace('</body>', `${tag}\n</body>`)
      : raw + tag;
  }

  return frameTemplate
    .replace('{{CONTENT}}', raw)
    .replace('{{HELPER}}', helperScript);
}

function clearEvents() {
  const eventsFile = path.join(stateDir, 'events');
  if (fs.existsSync(eventsFile)) fs.writeFileSync(eventsFile, '');
}

// ── Inactivity timer (30 min) ────────────────────────────────────────────────

let lastActivity = Date.now();
const IDLE_MS = 30 * 60 * 1000;

function resetTimer() { lastActivity = Date.now(); }

const idleCheck = setInterval(() => {
  if (Date.now() - lastActivity > IDLE_MS) {
    fs.writeFileSync(path.join(stateDir, 'server-stopped'), JSON.stringify({ reason: 'inactivity' }));
    process.exit(0);
  }
}, 60_000);

idleCheck.unref();

// ── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  resetTimer();

  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');

  // POST /events — record a browser click
  if (req.method === 'POST' && req.url === '/events') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const eventsFile = path.join(stateDir, 'events');
        fs.appendFileSync(eventsFile, body.trim() + '\n', 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch {
        res.writeHead(500);
        res.end('error');
      }
    });
    return;
  }

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /poll — check which file is current (for auto-reload)
  if (req.method === 'GET' && req.url === '/poll') {
    const newest = getNewestFile(screenDir);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ file: newest }));
    return;
  }

  // GET / — serve the newest HTML file
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const newest = getNewestFile(screenDir);
    if (!newest) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Brainstorm</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;
justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#94a3b8}</style>
</head><body><p>Đang chờ nội dung từ AI...</p><script>
setInterval(()=>fetch('/poll').then(r=>r.json()).then(d=>{if(d.file)location.reload()}),2000);
</script></body></html>`);
      return;
    }

    // Clear events when new content is served
    clearEvents();

    try {
      const page = buildPage(newest);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error building page: ${e.message}`);
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(0, host, () => {
  const port = server.address().port;
  const url = `http://${urlHost}:${port}`;

  const info = {
    type: 'server-started',
    port,
    url,
    screen_dir: screenDir,
    state_dir: stateDir,
    session_dir: sessionDir,
  };

  // Write server-info for background-launch recovery
  fs.writeFileSync(path.join(stateDir, 'server-info'), JSON.stringify(info, null, 2));

  // Single-line JSON to stdout so the launcher can capture it
  console.log(JSON.stringify(info));
});

process.on('SIGTERM', () => {
  fs.writeFileSync(path.join(stateDir, 'server-stopped'), JSON.stringify({ reason: 'sigterm' }));
  process.exit(0);
});

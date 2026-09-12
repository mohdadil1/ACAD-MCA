const http = require('http');
const { URL } = require('url');
const jwt = require('jsonwebtoken');
const { WebSocketServer } = require('ws');
const { runCode, LANGUAGES } = require('./runner');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('exec-service is running');
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  if (pathname !== '/ws') {
    socket.destroy();
    return;
  }

  const allowedOrigin = process.env.FRONT_END;
  if (allowedOrigin && req.headers.origin !== allowedOrigin) {
    socket.destroy();
    return;
  }

  const token = searchParams.get('token');
  if (!token || !process.env.SECRET_KEY) {
    socket.destroy();
    return;
  }

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
});

wss.on('connection', (ws) => {
  let activeRun = null;

  const send = (payload) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
  };

  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return send({ type: 'error', message: 'Invalid message' });
    }

    if (msg.type === 'run') {
      if (activeRun) {
        return send({ type: 'error', message: 'Run already in progress' });
      }
      if (!LANGUAGES[msg.language]) {
        return send({ type: 'error', message: 'Unsupported language' });
      }
      if (typeof msg.code !== 'string' || !msg.code.trim()) {
        return send({ type: 'error', message: 'Code is required' });
      }

      activeRun = await runCode({
        language: msg.language,
        code: msg.code,
        onStdout: (data) => send({ type: 'stdout', data }),
        onStderr: (data) => send({ type: 'stderr', data }),
        onError: (message) => {
          send({ type: 'error', message });
          activeRun = null;
        },
        onExit: (code, signal) => {
          send({ type: 'exit', code, signal });
          activeRun = null;
        },
      });
      return;
    }

    if (msg.type === 'stdin') {
      if (!activeRun || typeof msg.data !== 'string') return;
      activeRun.write(`${msg.data}\n`);
      return;
    }

    if (msg.type === 'kill') {
      if (activeRun) activeRun.kill();
      return;
    }
  });

  ws.on('close', () => {
    if (activeRun) activeRun.kill();
  });
});

server.listen(PORT, () => {
  console.log(`exec-service listening on port ${PORT}`);
});

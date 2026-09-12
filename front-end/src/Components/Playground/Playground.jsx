import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import Editor from '@monaco-editor/react';
import Jumbotron from '../UI/Jumbotron/Jumbotron';

const LANGUAGES = [
  {
    id: 'javascript',
    label: 'JavaScript',
    monacoId: 'javascript',
    starter: 'console.log("Hello, World!");\n',
  },
  {
    id: 'python',
    label: 'Python',
    monacoId: 'python',
    starter: 'print("Hello, World!")\n',
  },
  {
    id: 'java',
    label: 'Java',
    monacoId: 'java',
    starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  },
  {
    id: 'cpp',
    label: 'C++',
    monacoId: 'cpp',
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
  },
  {
    id: 'c',
    label: 'C',
    monacoId: 'c',
    starter: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
  },
];

const BACKSPACE = '\x7f';
const ENTER = '\r';
const CTRL_C = '\x03';

const Playground = () => {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');

  const current = LANGUAGES.find((l) => l.id === language);
  const execUrl = import.meta.env.VITE_EXEC_API_URL;

  const terminalContainerRef = useRef(null);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);
  const lineBufferRef = useRef('');
  const runningRef = useRef(false);

  useEffect(() => {
    const term = new Terminal({
      convertEol: true,
      fontSize: 14,
      cursorBlink: true,
      theme: { background: '#111827' },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalContainerRef.current);
    fitAddon.fit();
    term.writeln('Run your code to start a live session here.');

    term.onData((data) => {
      if (!runningRef.current) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      if (data === CTRL_C) {
        ws.send(JSON.stringify({ type: 'kill' }));
        return;
      }
      if (data === ENTER) {
        term.write('\r\n');
        ws.send(JSON.stringify({ type: 'stdin', data: lineBufferRef.current }));
        lineBufferRef.current = '';
        return;
      }
      if (data === BACKSPACE) {
        if (lineBufferRef.current.length > 0) {
          lineBufferRef.current = lineBufferRef.current.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }
      lineBufferRef.current += data;
      term.write(data);
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const closeSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    runningRef.current = false;
    setRunning(false);
  };

  const handleLanguageChange = (e) => {
    const nextId = e.target.value;
    const next = LANGUAGES.find((l) => l.id === nextId);
    setLanguage(nextId);
    setCode(next.starter);
    closeSocket();
    setStatus('');
    terminalRef.current?.reset();
  };

  const handleRun = () => {
    if (!execUrl) {
      setStatus('Playground execution service is not configured.');
      return;
    }
    closeSocket();

    const term = terminalRef.current;
    term.reset();
    lineBufferRef.current = '';
    setStatus('Connecting…');

    const token = localStorage.getItem('Token') || '';
    const ws = new WebSocket(`${execUrl}/ws?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('Running…');
      setRunning(true);
      runningRef.current = true;
      ws.send(JSON.stringify({ type: 'run', language, code }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'stdout' || msg.type === 'stderr') {
        term.write(msg.data);
      } else if (msg.type === 'exit') {
        term.writeln(`\r\n[process exited${msg.code !== null ? ` with code ${msg.code}` : ''}]`);
        setStatus('Finished');
        runningRef.current = false;
        setRunning(false);
      } else if (msg.type === 'error') {
        term.writeln(`\r\n[error] ${msg.message}`);
        setStatus('Error');
        runningRef.current = false;
        setRunning(false);
      }
    };

    ws.onerror = () => {
      setStatus('Failed to reach the execution service.');
    };

    ws.onclose = () => {
      runningRef.current = false;
      setRunning(false);
    };
  };

  const handleStop = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'kill' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <Jumbotron
        title="Code Playground"
        description="Write and run C, C++, Java, Python or JavaScript right in your browser."
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor column */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border border-gray-300 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                {running && (
                  <button
                    onClick={handleStop}
                    className="bg-red-600 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-red-700 transition-all"
                  >
                    Stop ■
                  </button>
                )}
                <button
                  onClick={handleRun}
                  disabled={running}
                  className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:shadow-brand-500/30 hover:from-brand-700 hover:to-brand-600 transition-all ${running ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {running ? 'Running…' : 'Run ▶'}
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
              <Editor
                height="50vh"
                language={current.monacoId}
                value={code}
                onChange={(value) => setCode(value ?? '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Terminal column */}
          <div className="w-full lg:w-[26rem] shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Terminal</h2>
              {status && <span className="text-xs text-gray-500">{status}</span>}
            </div>
            <div
              ref={terminalContainerRef}
              className="rounded-xl bg-[#111827] p-2 shadow-md h-[26rem] overflow-hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Type directly into the terminal when your program is waiting for input, just like a real console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;

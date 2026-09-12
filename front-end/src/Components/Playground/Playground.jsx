import React, { useState } from 'react';
import axios from 'axios';
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

const statusStyle = (description = '') => {
  if (description === 'Accepted') return 'bg-green-100 text-green-700';
  if (description.includes('Compilation') || description.includes('Runtime') || description.includes('Error')) {
    return 'bg-red-100 text-red-700';
  }
  return 'bg-yellow-100 text-yellow-700';
};

const Playground = () => {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const current = LANGUAGES.find((l) => l.id === language);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLanguageChange = (e) => {
    const nextId = e.target.value;
    const next = LANGUAGES.find((l) => l.id === nextId);
    setLanguage(nextId);
    setCode(next.starter);
    setResult(null);
    setError('');
  };

  const handleRun = async () => {
    setRunning(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post(`${apiUrl}/execute`, { language, code, stdin }, { withCredentials: true });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run code. Please try again.');
    } finally {
      setRunning(false);
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

              <button
                onClick={handleRun}
                disabled={running}
                className={`bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:shadow-brand-500/30 hover:from-brand-700 hover:to-brand-600 transition-all ${running ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {running ? 'Running…' : 'Run ▶'}
              </button>
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

            <div className="mt-4">
              <label className="block mb-1 text-sm font-semibold text-gray-600">Stdin (optional input for your program)</label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Type any input your program reads from stdin here"
              />
            </div>
          </div>

          {/* Output column */}
          <div className="w-full lg:w-[26rem] shrink-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Output</h2>
            <div className="rounded-xl bg-brand-dark text-slate-100 font-mono text-sm p-4 min-h-[16rem] shadow-md overflow-auto">
              {!result && !error && !running && (
                <span className="text-slate-400">Run your code to see the output here.</span>
              )}
              {running && <span className="text-slate-400">Executing…</span>}
              {error && <span className="text-red-400">{error}</span>}

              {result && (
                <div className="space-y-3">
                  {result.status?.description && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(result.status.description)}`}>
                      {result.status.description}
                    </span>
                  )}

                  {result.compile_output && (
                    <div>
                      <div className="text-slate-400 mb-1">Compile output</div>
                      <pre className="whitespace-pre-wrap break-words text-red-300">{result.compile_output}</pre>
                    </div>
                  )}

                  {result.stdout && (
                    <div>
                      <div className="text-slate-400 mb-1">Stdout</div>
                      <pre className="whitespace-pre-wrap break-words">{result.stdout}</pre>
                    </div>
                  )}

                  {result.stderr && (
                    <div>
                      <div className="text-slate-400 mb-1">Stderr</div>
                      <pre className="whitespace-pre-wrap break-words text-red-300">{result.stderr}</pre>
                    </div>
                  )}

                  {!result.stdout && !result.stderr && !result.compile_output && (
                    <span className="text-slate-400">Program produced no output.</span>
                  )}

                  {(result.time || result.memory) && (
                    <div className="text-slate-400 text-xs pt-2 border-t border-white/10">
                      {result.time && <span>Time: {result.time}s</span>}
                      {result.time && result.memory && <span> · </span>}
                      {result.memory && <span>Memory: {Math.round(result.memory / 1024)} MB</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;

const { spawn } = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const MAX_CONCURRENT_RUNS = 10;
const RUN_TIMEOUT_MS = 15000;
const OUTPUT_LIMIT_BYTES = 1024 * 1024; // 1MB
const MEMORY_LIMIT_KB = 256 * 1024; // 256MB, enforced via `ulimit -v`

let activeRuns = 0;

// Piped (non-tty) stdout is block-buffered by default for glibc/CPython
// programs, so a prompt printed without a trailing newline (e.g.
// `input("Enter a number: ")`) can sit in the buffer and never reach the
// client until it fills up. `-u` forces Python unbuffered; `stdbuf -o0 -e0`
// does the same for compiled C/C++ binaries via glibc's stdio. The JVM's
// System.out uses its own internal buffering (not glibc stdio), which
// stdbuf can't reach, so a bare `print()` right before a `Scanner` read can
// still lag until a `println`/flush/exit happens for Java specifically.
const LANGUAGES = {
  python: {
    fileName: 'main.py',
    run: (dir) => ['python3', ['-u', 'main.py'], dir],
  },
  javascript: {
    fileName: 'main.js',
    run: (dir) => ['node', ['main.js'], dir],
  },
  c: {
    fileName: 'main.c',
    compile: (dir) => ['gcc', ['main.c', '-O2', '-o', 'a.out'], dir],
    run: (dir) => ['stdbuf', ['-o0', '-e0', './a.out'], dir],
  },
  cpp: {
    fileName: 'main.cpp',
    compile: (dir) => ['g++', ['main.cpp', '-O2', '-o', 'a.out'], dir],
    run: (dir) => ['stdbuf', ['-o0', '-e0', './a.out'], dir],
  },
  java: {
    fileName: 'Main.java',
    compile: (dir) => ['javac', ['Main.java'], dir],
    run: (dir) => ['java', ['-cp', dir, 'Main'], dir],
  },
};

// Wraps the run command with a shell so `ulimit -v` applies a virtual-memory
// ceiling to it. Only PATH is passed through as env, so a sandboxed program
// can never read this service's own secrets (SECRET_KEY, FRONT_END, ...).
function spawnLimited(command, args, cwd) {
  const quoted = [command, ...args]
    .map((a) => `'${String(a).replace(/'/g, `'\\''`)}'`)
    .join(' ');
  const wrapped = `ulimit -v ${MEMORY_LIMIT_KB}; exec ${quoted}`;
  return spawn('bash', ['-c', wrapped], {
    cwd,
    env: { PATH: process.env.PATH },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

async function runCode({ language, code, onStdout, onStderr, onExit, onError }) {
  const lang = LANGUAGES[language];
  if (!lang) {
    onError('Unsupported language');
    return null;
  }
  if (activeRuns >= MAX_CONCURRENT_RUNS) {
    onError('Server is busy, please try again shortly');
    return null;
  }

  const dir = path.join(os.tmpdir(), `run-${crypto.randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, lang.fileName), code, 'utf-8');

  const cleanup = () => fs.rm(dir, { recursive: true, force: true }).catch(() => {});

  if (lang.compile) {
    const [cmd, args] = lang.compile(dir);
    const compileResult = await new Promise((resolve) => {
      const proc = spawn(cmd, args, { cwd: dir });
      let stderr = '';
      proc.stderr.on('data', (d) => {
        stderr += d;
      });
      proc.on('error', (err) => resolve({ code: 1, stderr: err.message }));
      proc.on('close', (code) => resolve({ code, stderr }));
    });
    if (compileResult.code !== 0) {
      onError(compileResult.stderr || 'Compilation failed');
      await cleanup();
      return null;
    }
  }

  activeRuns += 1;
  const [runCmd, runArgs] = lang.run(dir);
  const child = spawnLimited(runCmd, runArgs, dir);

  let outputBytes = 0;
  let killedForOutput = false;
  let killedForTimeout = false;

  const checkOutputLimit = (chunkLen) => {
    outputBytes += chunkLen;
    if (outputBytes > OUTPUT_LIMIT_BYTES && !killedForOutput) {
      killedForOutput = true;
      child.kill('SIGKILL');
    }
  };

  child.stdout.on('data', (d) => {
    checkOutputLimit(d.length);
    if (!killedForOutput) onStdout(d.toString('utf-8'));
  });
  child.stderr.on('data', (d) => {
    checkOutputLimit(d.length);
    if (!killedForOutput) onStderr(d.toString('utf-8'));
  });

  const timeoutHandle = setTimeout(() => {
    killedForTimeout = true;
    child.kill('SIGKILL');
  }, RUN_TIMEOUT_MS);

  child.on('error', (err) => {
    onError(`Failed to start process: ${err.message}`);
  });

  child.on('close', async (code, signal) => {
    clearTimeout(timeoutHandle);
    activeRuns -= 1;
    await cleanup();
    if (killedForTimeout) {
      onError(`Timed out after ${RUN_TIMEOUT_MS / 1000}s`);
    } else if (killedForOutput) {
      onError('Output limit exceeded');
    } else {
      onExit(code, signal);
    }
  });

  return {
    write(data) {
      try {
        child.stdin.write(data);
      } catch {
        // process may have already exited
      }
    },
    kill() {
      child.kill('SIGKILL');
    },
  };
}

module.exports = { runCode, LANGUAGES };

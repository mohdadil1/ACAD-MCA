const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true';

const LANGUAGE_IDS = {
  c: 50,        // C (GCC 9.2.0)
  cpp: 54,      // C++ (GCC 9.2.0)
  java: 62,     // Java (OpenJDK 13.0.1)
  python: 71,   // Python (3.8.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
};

const toBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');
const fromBase64 = (str) => (typeof str === 'string' ? Buffer.from(str, 'base64').toString('utf-8') : str);

const execute = async (req, res) => {
  const { language, code, stdin } = req.body;

  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    return res.status(400).json({ message: 'Unsupported language' });
  }
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ message: 'Code is required' });
  }
  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ message: 'Code execution is not configured on the server' });
  }

  try {
    // Judge0's non-base64 mode intermittently rejects otherwise-valid source
    // (e.g. certain quote/escape sequences) with a spurious "cannot be
    // converted to UTF-8" error, so always base64-encode/decode per Judge0's
    // own recommendation instead.
    const judgeRes = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: toBase64(code),
        language_id: languageId,
        stdin: toBase64(typeof stdin === 'string' ? stdin : ''),
      }),
    });

    if (!judgeRes.ok) {
      const detail = await judgeRes.text();
      console.error('Judge0 error:', judgeRes.status, detail);
      return res.status(502).json({ message: 'Execution service error' });
    }

    const result = await judgeRes.json();
    res.status(200).json({
      stdout: fromBase64(result.stdout),
      stderr: fromBase64(result.stderr),
      compile_output: fromBase64(result.compile_output),
      message: fromBase64(result.message),
      status: result.status,
      time: result.time,
      memory: result.memory,
    });
  } catch (err) {
    console.error('Failed to reach Judge0:', err.message);
    res.status(502).json({ message: 'Failed to reach execution service' });
  }
};

module.exports = { execute, LANGUAGE_IDS };

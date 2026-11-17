/**
 * server.mjs - Lightweight Local Development Server & AI Proxy
 * 
 * Provides:
 * 1. Fast static file serving with correct MIME types and caching headers.
 * 2. Secure local AI proxy: Zero API keys are ever committed to git or exposed to the browser.
 * 3. Support for Google Gemini, OpenAI, and local Ollama (100% offline/local).
 * 4. Zero external npm dependencies required! Built on native Node.js (v18+).
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '127.0.0.1';

// Load local configuration from .env.local, .env, or ai-config.local.json
const CONFIG_FILE = path.join(__dirname, 'ai-config.local.json');
const ENV_LOCAL_FILE = path.join(__dirname, '.env.local');

function loadLocalConfig() {
  let config = {
    provider: 'gemini', // 'gemini' | 'openai' | 'ollama' | 'none'
    apiKey: '',
    model: 'gemini-1.5-flash',
    baseUrl: ''
  };

  // 1. Try ai-config.local.json
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      config = { ...config, ...data };
    } catch (e) {
      console.warn('Could not parse ai-config.local.json:', e.message);
    }
  }

  // 2. Try .env.local
  if (fs.existsSync(ENV_LOCAL_FILE)) {
    try {
      const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [key, ...vals] = trimmed.split('=');
        const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
        if (key === 'GEMINI_API_KEY' && val) {
          config.apiKey = val;
          config.provider = 'gemini';
        } else if (key === 'OPENAI_API_KEY' && val) {
          config.apiKey = val;
          config.provider = 'openai';
        } else if (key === 'AI_MODEL' && val) {
          config.model = val;
        } else if (key === 'AI_BASE_URL' && val) {
          config.baseUrl = val;
        } else if (key === 'AI_PROVIDER' && val) {
          config.provider = val;
        }
      });
    } catch (e) {
      console.warn('Could not read .env.local:', e.message);
    }
  }

  // 3. Fallback to process.env
  if (!config.apiKey) {
    if (process.env.GEMINI_API_KEY) {
      config.apiKey = process.env.GEMINI_API_KEY;
      config.provider = 'gemini';
    } else if (process.env.OPENAI_API_KEY) {
      config.apiKey = process.env.OPENAI_API_KEY;
      config.provider = 'openai';
    }
  }

  return config;
}

function saveLocalConfig(newConfig) {
  const current = loadLocalConfig();
  const merged = { ...current, ...newConfig };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf8');
  return merged;
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.md': 'text/markdown; charset=utf-8',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

// Request Body Parser Helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// External AI API Call Handlers
async function callGemini(apiKey, model, systemPrompt, userMessages) {
  const modelName = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Convert chat messages to Gemini contents format
  const contents = [];

  // Add system instruction as first user message or separate field if supported
  let effectiveSystemPrompt = systemPrompt || '';

  userMessages.forEach(msg => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  });

  const payload = {
    contents,
    systemInstruction: effectiveSystemPrompt ? {
      parts: [{ text: effectiveSystemPrompt }]
    } : undefined,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const replyText = candidate?.content?.parts?.[0]?.text || 'No response generated.';
  return replyText;
}

async function callOpenAI(apiKey, model, baseUrl, systemPrompt, userMessages) {
  const endpoint = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '') + '/chat/completions';
  const modelName = model || 'gpt-4o-mini';

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  userMessages.forEach(msg => {
    messages.push({ role: msg.role, content: msg.content });
  });

  const headers = {
    'Content-Type': 'application/json'
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature: 0.4
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // API Endpoints
  // =========================================================================

  // 1. GET /api/ai/status
  if (req.method === 'GET' && pathname === '/api/ai/status') {
    const config = loadLocalConfig();
    const isConfigured = Boolean(config.apiKey || config.provider === 'ollama');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: isConfigured,
      provider: config.provider,
      model: config.model,
      baseUrl: config.baseUrl ? config.baseUrl.replace(/:\/\/.*@/, '://') : '',
      offlineSupported: true
    }));
    return;
  }

  // 2. POST /api/ai/config
  if (req.method === 'POST' && pathname === '/api/ai/config') {
    try {
      const body = await parseJsonBody(req);
      const updated = saveLocalConfig(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        provider: updated.provider,
        model: updated.model,
        configured: Boolean(updated.apiKey || updated.provider === 'ollama')
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 3. POST /api/ai/chat
  if (req.method === 'POST' && pathname === '/api/ai/chat') {
    try {
      const config = loadLocalConfig();
      if (!config.apiKey && config.provider !== 'ollama') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'AI Provider is not configured yet. Configure your API key or use Ollama in the settings.'
        }));
        return;
      }

      const body = await parseJsonBody(req);
      const { messages = [], mode = 'learning', context = {} } = body;

      // Build comprehensive mentor system prompt
      const systemPrompt = `You are the personal AI Engineering Mentor for the "32-Week Backend Engineering & Career Development Platform".
User Background:
- B.Tech in Information Technology with ERP software development experience (ASP.NET Web Forms, C#, SQL Server, Staff/Fee/HR/Payroll modules).
- Strong business logic understanding, module ownership, client interaction experience.
- Target: Backend Software Engineer / .NET Developer in top MNCs and product companies.
- Current Roadmap Position: Week ${context.currentWeek || 1} of 32 (Phase: ${context.currentPhase || 'Foundations'}).
- Target Weekly Study: 12 hours (4-hour deep block on Wednesday).

Your Mentoring Philosophy:
${mode === 'learning' 
  ? `MODE: LEARNING (DEFAULT)
- Guide with hints, structural thinking, Socratic questioning, and high-level architectural insight.
- Do NOT immediately dump full complete code solutions.
- Point the student towards the underlying CLR/SQL mechanics (e.g. how the GC, TaskScheduler, or SQL Optimizer handles this).
- Connect modern concepts back to their ERP background where relevant (e.g. comparing Web Forms ViewState / Page Lifecycle to ASP.NET Core middleware, or EF Core queries vs raw ADO.NET).
- Give short code snippets (3-8 lines) showing only the critical mechanism, leaving the implementation exercise for them.`
  : `MODE: SOLUTION (COMPREHENSIVE)
- Provide production-grade, architectural solutions that would pass senior engineering review at an MNC.
- Include structured C# / SQL code with defensive checks, exception handling, logging, and async best practices.
- Highlight time/space complexity, edge cases, and potential concurrency/race-condition pitfalls.
- Explain trade-offs clearly.`}

Tone: Calm, encouraging, professional, rigorous, and practical. No fluffy buzzwords. Keep responses clear and formatted in readable markdown.`;

      let reply = '';
      if (config.provider === 'gemini') {
        reply = await callGemini(config.apiKey, config.model, systemPrompt, messages);
      } else if (config.provider === 'ollama') {
        reply = await callOpenAI('', config.model || 'llama3.2', config.baseUrl || 'http://localhost:11434/v1', systemPrompt, messages);
      } else {
        reply = await callOpenAI(config.apiKey, config.model, config.baseUrl, systemPrompt, messages);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
    } catch (err) {
      console.error('Chat error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 4. POST /api/ai/generate-quiz
  if (req.method === 'POST' && pathname === '/api/ai/generate-quiz') {
    try {
      const config = loadLocalConfig();
      if (!config.apiKey && config.provider !== 'ollama') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'AI Provider is not configured yet. Configure your API key or run Ollama.'
        }));
        return;
      }

      const body = await parseJsonBody(req);
      const {
        topic = 'C# Async/Await & Concurrency',
        count = 5,
        difficulty = 'advanced',
        includeEdgeCases = true,
        includeMncQuestions = true,
        includeCodeSnippets = true,
        resolvedQuestions = [],
        weakConcepts = []
      } = body;

      const numQuestions = Math.min(50, Math.max(1, parseInt(count, 10) || 5));

      const exclusionText = resolvedQuestions.length > 0
        ? `\nCRITICAL DEDUPLICATION: DO NOT generate or repeat any questions similar or identical to these already resolved questions:\n${resolvedQuestions.slice(0, 30).map((q, idx) => `${idx + 1}. ${typeof q === 'string' ? q : q.question}`).join('\n')}`
        : '';

      const weakConceptsText = weakConcepts.length > 0
        ? `\nADAPTIVE WEAKNESS TARGETING: The candidate has previously struggled with these concepts or made errors here:\n${weakConcepts.slice(0, 10).map((w, idx) => `${idx + 1}. Concept: "${w.concept || w.topic}" (Previous issue: ${w.user_mistake || w.explanation || 'Misunderstood mechanics'})`).join('\n')}\nExplicitly craft questions testing these specific concepts from fresh angles to diagnose and train their deep comprehension!`
        : '';

      const systemPrompt = `You are a Principal Backend Engineering Interviewer and Curriculum Architect designing technical assessment papers for senior backend engineering positions (.NET, C#, SQL Server, Distributed Architecture) at top MNCs (Microsoft, Amazon, Goldman Sachs, Uber, Tier-1 Product Companies).

Task: Generate an authentic, rigorous assessment paper with exactly ${numQuestions} questions on the topic "${topic}".
Difficulty: ${difficulty.toUpperCase()}.
Constraints:
- ${includeEdgeCases ? 'TRICKY EDGE CASES & BOUNDARY SCENARIOS ARE MANDATORY. Include subtle production bugs, memory allocation caveats (struct lifting, LOH fragmentation), CLR state machine quirks, concurrency deadlocks, and SQL execution plan regressions (non-SARGable scans, parameter sniffing).' : 'Balanced conceptual and implementation questions.'}
- ${includeMncQuestions ? 'Draw from authentic question patterns asked in Tier-1 MNC written assessments and senior technical rounds.' : 'Standard technical questions.'}
- ${includeCodeSnippets ? 'Include realistic C# or SQL code snippets inside backticks testing output prediction, thread safety, or bug diagnosis.' : ''}
${exclusionText}
${weakConceptsText}

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "quiz_title": "${topic} — ${difficulty.toUpperCase()} Assessment",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "total_questions": ${numQuestions},
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "concept": "Specific concept tested (e.g. Async SynchronizationContext)",
      "question": "Clear, precise question text with code snippets inside backticks if applicable",
      "options": [
        "A) Option A text",
        "B) Option B text",
        "C) Option C text",
        "D) Option D text"
      ],
      "correct_answer": "B",
      "explanation": "Deep, comprehensive explanation of the underlying CLR/SQL mechanics explaining why B is correct and why other choices fail.",
      "edge_case_tip": "Critical production tip or gotcha to remember in enterprise systems."
    }
  ]
}
Return pure JSON with no markdown wrapping or preamble.`;

      const userMessages = [{ role: 'user', content: `Generate ${numQuestions} ${difficulty} backend engineering assessment questions on ${topic}. Ensure tricky edge cases and MNC interview standards.` }];

      let rawText = '';
      if (config.provider === 'gemini') {
        rawText = await callGemini(config.apiKey, config.model, systemPrompt, userMessages);
      } else if (config.provider === 'ollama') {
        rawText = await callOpenAI('', config.model || 'llama3.2', config.baseUrl || 'http://localhost:11434/v1', systemPrompt, userMessages);
      } else {
        rawText = await callOpenAI(config.apiKey, config.model, config.baseUrl, systemPrompt, userMessages);
      }

      // Extract JSON if model wrapped it in ```json ... ```
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(json)?\n?/, '').replace(/```$/, '').trim();
      }

      const quizData = JSON.parse(cleaned);

      // Filter out any duplicates against resolvedQuestions
      if (Array.isArray(quizData.questions) && resolvedQuestions.length > 0) {
        const resolvedNormalized = resolvedQuestions.map(rq => (typeof rq === 'string' ? rq : rq.question || '').toLowerCase().trim());
        quizData.questions = quizData.questions.filter(q => {
          const qNorm = (q.question || '').toLowerCase().trim();
          return !resolvedNormalized.some(rn => rn && qNorm.includes(rn.substring(0, 30)));
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(quizData));
    } catch (err) {
      console.error('Quiz generation error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 5. POST /api/ai/mock-interview
  if (req.method === 'POST' && pathname === '/api/ai/mock-interview') {
    try {
      const config = loadLocalConfig();
      if (!config.apiKey && config.provider !== 'ollama') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'AI Provider is not configured yet.'
        }));
        return;
      }

      const body = await parseJsonBody(req);
      const { category = 'csharp', questionIndex = 0, userResponse = '', history = [] } = body;

      const systemPrompt = `You are a Principal Backend Engineering Interviewer conducting a mock technical interview for a candidate with an ERP software development background transitioning to modern Backend Software Engineer (.NET/C#) roles in MNCs.
Category: ${category}.
Current Question Number: ${questionIndex + 1}.

If userResponse is empty, ask question #${questionIndex + 1} in this category. It should be a realistic, non-trivial MNC interview question testing depth, trade-offs, and internals.
If userResponse is provided:
1. Provide a rigorous, objective evaluation of the candidate's answer:
   - Strengths in their answer
   - Crucial points or edge-cases they missed (e.g. memory allocation, deadlock risk, SQL indexing, connection exhaustion)
   - How a Principal/Senior Engineer in an MNC would formulate the response
2. Give a score from 1 to 10 with brief justification.
3. Offer the next question or conclude with overall interview advice if completed.

Format your evaluation cleanly with clear headings.`;

      const userMessages = [];
      history.forEach(h => {
        userMessages.push({ role: h.role, content: h.content });
      });
      if (userResponse) {
        userMessages.push({ role: 'user', content: `Candidate answer: "${userResponse}"` });
      } else {
        userMessages.push({ role: 'user', content: `Please ask question #${questionIndex + 1} for category ${category}.` });
      }

      let reply = '';
      if (config.provider === 'gemini') {
        reply = await callGemini(config.apiKey, config.model, systemPrompt, userMessages);
      } else if (config.provider === 'ollama') {
        reply = await callOpenAI('', config.model || 'llama3.2', config.baseUrl || 'http://localhost:11434/v1', systemPrompt, userMessages);
      } else {
        reply = await callOpenAI(config.apiKey, config.model, config.baseUrl, systemPrompt, userMessages);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
    } catch (err) {
      console.error('Interview error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // =========================================================================
  // Static File Serving
  // =========================================================================
  if (req.method === 'GET') {
    let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
      safePath = '/index.html';
    }

    const filePath = path.join(__dirname, safePath);

    // Prevent directory traversal outside root
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access Denied');
      return;
    }

    // Never serve private secret files
    const basename = path.basename(filePath);
    if (basename.startsWith('.env') || basename === 'ai-config.local.json') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden File');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${pathname}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.listen(PORT, HOST, () => {
  console.log(`
====================================================================
  Backend Journey — 32-Week Engineering Companion Server
====================================================================
  App URL:      http://${HOST}:${PORT}
  AI Proxy:     http://${HOST}:${PORT}/api/ai/status
  Security:     Zero-leakage local proxy enabled (.env.local protected)
  Status:       Ready! Press Ctrl+C to stop.
====================================================================
  `);
});

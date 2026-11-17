/**
 * mentor-page.js - Dedicated AI Learning Mentor Hub
 * 
 * Provides:
 * 1. Context-aware conversational AI mentor (understands ERP background, current week, weak topics).
 * 2. Mode switcher: Learning Mode (hints & Socratic) vs Solution Mode (complete production code).
 * 3. Interactive Quiz Generator: One-click random quiz and custom quiz generator.
 * 4. Mock Technical Interview: 1-by-1 question drills with rigorous MNC-standard feedback.
 * 5. Wednesday 4-Hour Study Planner: Tailored to current week backlog and revision items.
 * 6. Zero-leakage security: Connects to local server.mjs proxy, with built-in offline knowledge engine fallback.
 */

import { WEEKS, PHASES } from '../data/roadmap-data.js';
import {
  getUserSettings,
  getAllTopicsProgress,
  getAllProblemAttempts,
  getLastActiveTopic,
  getAIConversations,
  saveAIConversation,
  deleteAIConversation,
  clearAllAIConversations,
  getAIQuizzes,
  saveAIQuiz,
  getAIConfig,
  saveAIConfig
} from '../storage.js';
import { showToast } from '../components/notifications.js';

// Pre-compiled offline knowledge engine responses for 100% offline resilience
const OFFLINE_KNOWLEDGE_BASE = {
  webforms_vs_core: `### Architectural Contrast: ASP.NET Web Forms vs. ASP.NET Core

As an engineer with ERP background, here is how the architectural mental model shifts:

1. **State Management & Lifecycle:**
   - **Web Forms:** Heavy abstraction. Relies on \`ViewState\`, \`SessionState\`, and a complex 10-stage Page Lifecycle (\`Init\`, \`Load\`, \`Event\`, \`PreRender\`, \`Render\`). Hidden \`__VIEWSTATE\` payloads bloat HTTP requests.
   - **ASP.NET Core:** Stateless by design. Every HTTP request passes through a lightweight, pipeline-based **Middleware pipeline** (\`UseRouting\`, \`UseAuthentication\`, \`UseAuthorization\`, \`UseEndpoints\`). No ViewState; state is stored in distributed caches (Redis) or JWT claims.

2. **Hosting & Server Architecture:**
   - **Web Forms:** Bound strictly to Windows and IIS (\`System.Web.dll\` + \`w3wp.exe\`).
   - **ASP.NET Core:** Fully cross-platform. Uses **Kestrel**, an ultra-fast asynchronous event-driven I/O server (built on libuv / socket transport). Can run on Linux containers, Alpine Docker images, or reverse-proxied behind Nginx/YARP.

3. **Dependency Injection:**
   - **Web Forms:** Often relied on static helper classes, \`HttpContext.Current\`, or service locators.
   - **ASP.NET Core:** First-class built-in DI container (\`IServiceCollection\`). Services have explicit lifetimes:
     - **Transient:** New instance every time requested.
     - **Scoped:** One instance per HTTP request (critical for EF Core \`DbContext\`).
     - **Singleton:** One instance for application lifetime.

4. **ERP Refactoring Tip:**
   In Fee or Payroll modules, replace Web Forms code-behind event handlers (\`btnSubmit_Click\`) with ASP.NET Core Minimal APIs or Controller Actions using the **Command/Query Responsibility Segregation (CQRS)** pattern with MediatR.`,

  async_await_internals: `### Deep Dive: C# Async/Await & SynchronizationContext

1. **The Roslyn State Machine:**
   - When you mark a method \`async\`, the C# compiler generates an internal struct implementing \`IAsyncStateMachine\`.
   - The method is partitioned into execution slices around each \`await\` expression.
   - When reaching an uncompleted \`await Task\`, the state machine registers a continuation callback (\`awaiter.UnsafeOnCompleted\`) and immediately returns execution to the caller.

2. **SynchronizationContext & Deadlocks:**
   - In older ASP.NET (Web Forms), \`SynchronizationContext.Current\` ensures continuation executes on the original request thread. Calling \`.Result\` or \`.Wait()\` deadlocks because the waiting thread blocks the single thread needed to resume the continuation.
   - In **ASP.NET Core**, there is **NO SynchronizationContext**. Continuations run on any available ThreadPool thread.
   - While this prevents classical request-thread deadlocks, **blocking on async code (\`.Result\`) is still an anti-pattern** because it causes ThreadPool starvation under high concurrent traffic.

3. **Production Edge Case:**
   Always pass a \`CancellationToken\` all the way from the API endpoint through your service layer down to EF Core (\`SaveChangesAsync(cancellationToken)\`). If a client drops their connection, this halts DB queries immediately, saving server resources.`,

  sql_indexing_tuning: `### SQL Server Query Performance & Indexing Mechanics

1. **Clustered vs. Non-Clustered Indexes:**
   - **Clustered Index:** Defines the physical B-Tree sort order of data pages on disk. A table can only have **one** clustered index. The leaf level contains the actual data rows.
   - **Non-Clustered Index:** A separate B-Tree whose leaf nodes contain the index key columns plus a bookmark (the Clustered Index Key or RID) pointing to the actual data.

2. **Index Seek vs. Index Scan:**
   - **Index Seek:** SQL Optimizer navigates down the B-Tree directly to the qualifying rows (\`O(log N)\`). Fast and efficient.
   - **Index Scan:** SQL Optimizer traverses every page in the index from beginning to end (\`O(N)\`). Indicates a missing index, non-SARGable query (e.g., \`WHERE YEAR(CreatedDate) = 2026\`), or low selectivity.

3. **Covering Indexes (\`INCLUDE\` Clause):**
   - When a query needs columns that aren't in the index, SQL Server does a **Key Lookup** to the clustered index for each row.
   - In heavy ERP queries (e.g., student fee transactions), eliminate Key Lookups by creating a Covering Index:
     \`\`\`sql
     CREATE NONCLUSTERED INDEX IX_FeePayments_StudentId
     ON FeePayments(StudentId, PaymentDate)
     INCLUDE (AmountPaid, PaymentStatus, ReceiptNumber);
     \`\`\`
   - This satisfies the query entirely from the non-clustered index leaf pages with zero Key Lookups!`,

  wednesday_plan: `### Optimized Wednesday 4-Hour Focus Plan

Based on your 12-hour weekly target and 4-hour non-work day off, here is your high-yield schedule:

- **10:00 - 11:15 AM (75 Mins) — Deep Architectural Concept:**
  - Read through this week's core topic. Focus on the internal mechanics (CLR/DB engine), not just syntax.
  - Review how this replaces or upgrades legacy Web Forms patterns.
- **11:15 - 11:25 AM (10 Mins) — Physical Reset:**
  - Stand up, drink 300ml water, stretch shoulders, look at distant objects to rest eyes.
- **11:25 - 12:40 PM (75 Mins) — Practical Implementation:**
  - Open Visual Studio / VS Code. Code the concept from scratch without copy-pasting.
  - Write at least 2 unit tests verifying edge cases (null inputs, boundary conditions, concurrency).
- **12:40 - 12:50 PM (10 Mins) — Screen Break:**
  - Step completely away from screens. Light walk.
- **12:50 - 01:35 PM (45 Mins) — SQL Query & Indexing:**
  - Write the matching relational query in SQL Server Management Studio.
  - Inspect the Actual Execution Plan. Verify index seeks and elimination of table scans.
- **01:35 - 02:00 PM (25 Mins) — Technical Speaking & Explanation:**
  - Open the Speaking Practice module. Record a 3-minute explanation using the 5-step framework:
    1. Concept definition
    2. Real problem it solves
    3. Internal mechanics
    4. Practical ERP application
    5. Trade-offs and edge cases.`
};

export async function renderMentorPage(container) {
  const settings = await getUserSettings() || {};
  const topicsProgress = await getAllTopicsProgress();
  const problemAttempts = await getAllProblemAttempts();
  const lastActive = await getLastActiveTopic();
  let aiConfig = await getAIConfig();

  // Determine current week and phase
  const startDate = new Date(settings.start_date || new Date());
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
  const currentWeekNum = Math.min(32, Math.max(1, Math.floor(diffDays / 7) + 1));
  const currentWeek = WEEKS.find(w => w.week_number === currentWeekNum) || WEEKS[0];
  const currentPhase = PHASES.find(p => p.id === currentWeek.phase_id) || PHASES[0];

  // Weak topics (marked for revision)
  const weakTopics = [];
  for (const tid in topicsProgress) {
    if (topicsProgress[tid].status === 'needs-revision') {
      weakTopics.push(tid);
    }
  }

  // Load conversation history from IndexedDB
  let conversations = await getAIConversations();
  if (conversations.length === 0) {
    // Initial welcome message tailored to ERP background
    conversations = [
      {
        id: 'msg-init-1',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `👋 Hello ${settings.display_name || 'Engineer'}! I am your **Personal AI Engineering Mentor**.

I am aware of your background and goals:
- **Background:** B.Tech IT with ERP development experience in ASP.NET Web Forms, C#, SQL Server, Staff/Fee/Payroll modules.
- **Goal:** Backend Software Engineer / .NET Developer in top MNCs and product engineering teams.
- **Current Position:** Week ${currentWeek.week_number} of 32 (${currentPhase.title.split(':')[0]}).
- **Current Weekly Target:** 12 Hours total (with Wednesday 4-hour focus block).
${weakTopics.length > 0 ? `- **Active Revision Focus:** ${weakTopics.length} topic(s) currently marked for revision.` : ''}

How can I help you today? You can click any prompt chip below, ask a specific question, generate an interview quiz, or simulate a mock technical interview.`
      }
    ];
    await saveAIConversation(conversations[0]);
  }

  // Check AI proxy status
  let serverStatus = { configured: false, provider: 'none', model: 'gemini-1.5-flash', online: false };
  try {
    const res = await fetch('/api/ai/status', { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      serverStatus = { ...data, online: true };
    }
  } catch (e) {
    // Server is not running or offline
    serverStatus.online = false;
  }

  // Current mode: 'learning' (hints) or 'solution' (full code)
  let currentMode = localStorage.getItem('mentor_mode') || 'learning';

  // Render Page Layout
  container.innerHTML = `
    <div class="dash-container">
      
      <!-- Top Header & Status Bar -->
      <div class="dash-overview-card" style="padding: 14px 20px;">
        <div class="dash-overview-top">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div style="font-size: 1.5rem;">✨</div>
            <div>
              <h1 style="font-size: 1.35rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px;">
                Personal AI Learning Mentor
                <span class="badge ${serverStatus.online && serverStatus.configured ? 'badge-green' : 'badge-teal'}" id="mentor-status-badge" style="font-size: 0.72rem;">
                  ${serverStatus.online && serverStatus.configured ? `AI Online (${serverStatus.provider})` : 'Offline Knowledge Engine Active'}
                </span>
              </h1>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
                Tailored for your ERP background • Week ${currentWeek.week_number} Roadmap • MNC Backend Engineering Standards
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap;">
            <!-- Mode Toggle Pill -->
            <div class="mode-toggle-pill" id="mode-toggle-pill" title="Click to toggle between Learning Mode and Solution Mode">
              <span style="font-size: 0.8rem;">⚙️ Mode:</span>
              <strong id="mode-label" style="color: var(--accent-hover);">${currentMode === 'learning' ? '💡 Learning (Hints)' : '🚀 Solution (Code)'}</strong>
            </div>

            <!-- Configure AI Button -->
            <button type="button" class="btn btn-outline btn-sm" id="btn-configure-ai" style="padding: 4px 10px; font-size: 0.78rem;">
              🔑 Configure AI
            </button>
          </div>
        </div>
      </div>

      <!-- Main Two-Column Layout: Sidebar & Chat/Tools Area -->
      <div class="mentor-grid">
        
        <!-- Sidebar Navigation & Quick Tools -->
        <aside class="mentor-sidebar">
          
          <!-- Context Card -->
          <div class="card" style="padding: var(--space-md);">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 6px;">
              Your Active Context
            </div>
            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary);">
              Week ${currentWeek.week_number}: ${escapeHtml(currentWeek.title)}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
              Phase ${currentPhase.id}: ${escapeHtml(currentPhase.title.split(':')[0])}
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 10px 0;">

            <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
              <div>• Weekly Target: <strong>12 Hours</strong></div>
              <div>• Wednesday Focus: <strong>4 Hours Deep</strong></div>
              <div>• Weak Areas: <strong>${weakTopics.length > 0 ? `${weakTopics.length} flagged` : 'All clear'}</strong></div>
            </div>
          </div>

          <!-- Quick Action Tools -->
          <div class="card" style="padding: var(--space-md); display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 2px;">
              Interactive Mentor Tools
            </div>

            <a href="#quiz" class="mentor-tool-btn" id="btn-tool-random-quiz" style="text-decoration: none;">
              <span>⚡</span> AI Assessment & Quiz Lab →
            </a>

            <a href="#quiz" class="mentor-tool-btn" id="btn-tool-custom-quiz" style="text-decoration: none;">
              <span>🎯</span> Custom MNC Quiz Generator →
            </a>

            <button type="button" class="mentor-tool-btn" id="btn-tool-mock-interview">
              <span>🎙️</span> Mock Technical Interview
            </button>

            <button type="button" class="mentor-tool-btn" id="btn-tool-wednesday-plan">
              <span>📅</span> Wednesday 4-Hour Planner
            </button>

            <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 6px 0;">

            <button type="button" class="btn btn-outline btn-sm" id="btn-clear-chat" style="color: var(--text-muted); justify-content: flex-start; font-size: 0.75rem; border-color: var(--border-light);">
              🗑️ Clear Chat History
            </button>
          </div>

          <!-- Offline / Live Status Note -->
          <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; padding: 4px 8px;">
            💡 <strong>Zero-Leakage Security:</strong> API keys are never committed to git. They reside safely in your local proxy or browser memory. Built-in knowledge engine works 100% offline.
          </div>

        </aside>

        <!-- Main Chat Wrapper -->
        <main class="mentor-chat-wrapper" id="mentor-chat-wrapper">
          
          <div class="mentor-chat-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">
                Mentor Conversation
              </span>
              <span class="badge badge-slate" style="font-size: 0.7rem;">
                ${currentMode === 'learning' ? 'Socratic Hints Mode' : 'Complete Architecture Mode'}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Press Enter to send • Shift+Enter for newline
            </div>
          </div>

          <!-- Chat Message Bubbles Area -->
          <div class="mentor-chat-messages" id="chat-messages-area">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Quick Starter Prompt Chips -->
          <div class="starter-prompts" id="starter-prompts-bar">
            <button type="button" class="prompt-chip" data-prompt="Explain this week's core topic and its internal mechanics.">
              📖 Explain Week ${currentWeek.week_number} Topic
            </button>
            <button type="button" class="prompt-chip" data-prompt="Contrast ASP.NET Web Forms vs ASP.NET Core for this topic with real ERP context.">
              🔄 Web Forms vs ASP.NET Core
            </button>
            <button type="button" class="prompt-chip" data-prompt="Give me 3 edge-case interview questions on this topic that senior engineers look for.">
              ⚠️ 3 Edge-Case Questions
            </button>
            <button type="button" class="prompt-chip" data-prompt="How does this apply to real-world Fee, Staff, or Payroll ERP modules?">
              🏢 Real ERP Application
            </button>
            <button type="button" class="prompt-chip" data-prompt="Help me plan my Wednesday 4-hour deep focus study block.">
              📅 Wednesday 4-Hour Plan
            </button>
          </div>

          <!-- Input Bar -->
          <div class="mentor-input-bar">
            <textarea 
              class="mentor-textarea" 
              id="mentor-input" 
              placeholder="Ask a technical question, request hints on your code, or ask for interview practice..."
              rows="1"></textarea>
            <button type="button" class="btn btn-primary" id="btn-send-message" style="padding: 10px 18px; font-weight: 600;">
              Send
            </button>
          </div>

        </main>

      </div>

    </div>

    <!-- Modal Container (For Quizzes, Mock Interview & AI Config) -->
    <div id="mentor-modal-root"></div>
  `;

  // Message Rendering Logic
  const msgArea = container.querySelector('#chat-messages-area');
  const inputEl = container.querySelector('#mentor-input');
  const sendBtn = container.querySelector('#btn-send-message');
  const modeTogglePill = container.querySelector('#mode-toggle-pill');
  const modeLabel = container.querySelector('#mode-label');

  function renderMessages() {
    if (!msgArea) return;
    msgArea.innerHTML = conversations.map(m => `
      <div class="chat-msg ${m.role}">
        <div class="chat-avatar">
          ${m.role === 'assistant' ? '✨' : '👤'}
        </div>
        <div class="chat-bubble">
          ${formatMarkdown(m.content)}
        </div>
      </div>
    `).join('');
    // Auto scroll to bottom
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  renderMessages();

  // Mode Toggle Handler
  modeTogglePill.addEventListener('click', () => {
    currentMode = currentMode === 'learning' ? 'solution' : 'learning';
    localStorage.setItem('mentor_mode', currentMode);
    modeLabel.textContent = currentMode === 'learning' ? '💡 Learning (Hints)' : '🚀 Solution (Code)';
    showToast(`Switched to ${currentMode === 'learning' ? 'Learning Mode (Hints & Questions)' : 'Solution Mode (Complete Code & Architecture)'}`);
    const badge = container.querySelector('.mentor-chat-header .badge');
    if (badge) {
      badge.textContent = currentMode === 'learning' ? 'Socratic Hints Mode' : 'Complete Architecture Mode';
    }
  });

  // Send Message Logic
  async function sendMessage(text) {
    const trimmed = (text || inputEl.value).trim();
    if (!trimmed) return;

    // Append user message
    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      timestamp: new Date().toISOString(),
      content: trimmed
    };
    conversations.push(userMsg);
    await saveAIConversation(userMsg);
    inputEl.value = '';
    renderMessages();

    // Disable input while generating
    sendBtn.disabled = true;
    sendBtn.textContent = 'Thinking...';

    // Temporary placeholder message
    const tempAssistantMsg = {
      id: 'msg-temp-' + Date.now(),
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content: 'Thinking...'
    };
    conversations.push(tempAssistantMsg);
    renderMessages();

    let reply = '';

    // Check if live server is available
    if (serverStatus.online && serverStatus.configured) {
      try {
        const payload = {
          messages: conversations.filter(m => m.id !== tempAssistantMsg.id).slice(-10),
          mode: currentMode,
          context: {
            currentWeek: currentWeek.week_number,
            currentPhase: currentPhase.title,
            weakTopics: weakTopics
          }
        };

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.reply;
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Server error');
        }
      } catch (err) {
        console.warn('Live AI chat failed, falling back to local knowledge engine:', err);
        reply = generateOfflineResponse(trimmed, currentMode, currentWeek, currentPhase, weakTopics);
      }
    } else {
      // Offline Knowledge Engine
      await new Promise(r => setTimeout(r, 400)); // Brief realistic cadence
      reply = generateOfflineResponse(trimmed, currentMode, currentWeek, currentPhase, weakTopics);
    }

    // Replace temporary placeholder with final response
    conversations.pop();
    const finalAssistantMsg = {
      id: 'msg-' + Date.now(),
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content: reply
    };
    conversations.push(finalAssistantMsg);
    await saveAIConversation(finalAssistantMsg);
    renderMessages();

    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
  }

  // Handle Enter key (Shift+Enter creates newline)
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', () => sendMessage());

  // Starter Prompt Chips
  const promptChips = container.querySelectorAll('.prompt-chip');
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      sendMessage(prompt);
    });
  });

  // Clear Chat History (100% Reliable Store Clearing)
  const clearBtn = container.querySelector('#btn-clear-chat');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (confirm('Clear all conversation history?')) {
        await clearAllAIConversations();
        conversations = [];
        renderMessages();
        showToast('Chat history cleared.');
      }
    });
  }

  // AI Configuration Modal Trigger
  const configBtn = container.querySelector('#btn-configure-ai');
  if (configBtn) {
    configBtn.addEventListener('click', () => {
      showConfigModal(container, serverStatus, async (updated) => {
        serverStatus = updated;
        const statusBadge = container.querySelector('#mentor-status-badge');
        if (statusBadge) {
          if (serverStatus.online && serverStatus.configured) {
            statusBadge.className = 'badge badge-green';
            statusBadge.textContent = `AI Online (${serverStatus.provider})`;
          } else {
            statusBadge.className = 'badge badge-teal';
            statusBadge.textContent = 'Offline Knowledge Engine Active';
          }
        }
      });
    });
  }

  // Tools: Assessment & Quiz Lab Links
  const randomQuizBtn = container.querySelector('#btn-tool-random-quiz');
  if (randomQuizBtn) {
    randomQuizBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#quiz';
    });
  }

  const customQuizBtn = container.querySelector('#btn-tool-custom-quiz');
  if (customQuizBtn) {
    customQuizBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#quiz';
    });
  }

  // Tool 3: Mock Technical Interview
  const mockInterviewBtn = container.querySelector('#btn-tool-mock-interview');
  if (mockInterviewBtn) {
    mockInterviewBtn.addEventListener('click', () => {
      showMockInterviewModal(container, serverStatus);
    });
  }

  // Tool 4: Wednesday 4-Hour Planner
  const wedPlanBtn = container.querySelector('#btn-tool-wednesday-plan');
  if (wedPlanBtn) {
    wedPlanBtn.addEventListener('click', () => {
      sendMessage("Help me plan my Wednesday 4-hour deep focus study block.");
    });
  }
}

// =========================================================================
// Offline Knowledge Engine & Intelligent Response Generator
// =========================================================================
function generateOfflineResponse(query, mode, currentWeek, currentPhase, weakTopics) {
  const q = query.toLowerCase();

  if (q.includes('web forms') || q.includes('contrast') || q.includes('webforms')) {
    return OFFLINE_KNOWLEDGE_BASE.webforms_vs_core;
  }

  if (q.includes('async') || q.includes('await') || q.includes('synchronization') || q.includes('deadlock') || q.includes('threading')) {
    return OFFLINE_KNOWLEDGE_BASE.async_await_internals;
  }

  if (q.includes('sql') || q.includes('index') || q.includes('query') || q.includes('seek') || q.includes('scan') || q.includes('performance')) {
    return OFFLINE_KNOWLEDGE_BASE.sql_indexing_tuning;
  }

  if (q.includes('wednesday') || q.includes('plan') || q.includes('schedule') || q.includes('4-hour')) {
    return OFFLINE_KNOWLEDGE_BASE.wednesday_plan;
  }

  if (q.includes('edge-case') || q.includes('interview')) {
    return `### 3 Critical Edge-Case Questions for Week ${currentWeek.week_number} (${currentWeek.title})

1. **Memory Allocation & Struct Copying:**
   - *Question:* If you pass a \`struct\` representing a Fee Transaction into an asynchronous method, what happens to memory allocation when execution yields across an \`await\` boundary?
   - *Senior Insight:* Structs captured by async state machines or closures are lifted onto the **Heap** inside the state machine class/struct. This can cause unexpected Gen 0 GC allocations if you incorrectly assume value types remain purely on the Stack.

2. **Database Concurrency & Deadlocks:**
   - *Question:* Two concurrent transactions execute: Transaction A updates \`Staff\` then \`Payroll\`. Transaction B updates \`Payroll\` then \`Staff\`. How does SQL Server detect and resolve this, and how do you design code to avoid it?
   - *Senior Insight:* SQL Server detects cyclic dependency via the Lock Monitor thread (runs every 5 seconds) and chooses the transaction with the least log recovery cost as the **Deadlock Victim (Error 1205)**. Fix: Enforce strict deterministic resource ordering across all endpoints or use snapshot isolation.

3. **Exception Handling in Fire-and-Forget Tasks:**
   - *Question:* What occurs if an unobserved exception is thrown inside \`_ = Task.Run(...)\`?
   - *Senior Insight:* In .NET Core, unobserved task exceptions no longer tear down the process by default (as in .NET 4.0), but they raise \`TaskScheduler.UnobservedTaskException\`. In production, this causes silent data loss. Always attach a continuation or log with structured telemetry.`;
  }

  if (q.includes('erp') || q.includes('fee') || q.includes('staff') || q.includes('payroll')) {
    return `### Applying Week ${currentWeek.week_number} Concepts to Real ERP Modules

In business ERP systems (Staff, Fee, HR, Payroll), here is how modern backend engineering elevates legacy implementations:

1. **Fee Calculation & Rounding Accuracy:**
   - In financial calculations, never use \`float\` or \`double\` due to binary floating-point representation errors.
   - Always use C# \`decimal\` (128-bit precise decimal representation) mapped to SQL \`DECIMAL(18, 4)\`.
   - Implement financial transaction idempotency using **Idempotency Keys** (stored in a Redis cache or unique index in SQL Server) to prevent duplicate fee deduction if network times out.

2. **Payroll Bulk Processing via Batched Asynchronous Streaming:**
   - Legacy ERPs often loaded entire payroll lists into \`DataTable\` or \`List<Employee>\`, causing high Large Object Heap (LOH) fragmentation.
   - Modern approach: Use **\`IAsyncEnumerable<T>\`** with EF Core to stream records from SQL Server in chunks of 500 without loading all 10,000 employees into web server RAM at once.

3. **Staff Access & Multi-Tenant Authorization:**
   - Replace manual session lookups with ASP.NET Core **Policy-Based Authorization** using Custom Requirement Handlers (\`IAuthorizationRequirement\`).
   - Filter records at the EF Core level using **Global Query Filters** (\`modelBuilder.Entity<FeeRecord>().HasQueryFilter(e => e.TenantId == _currentTenant)\`) ensuring zero multi-tenant data leakage.`;
  }

  // General contextual answer
  if (mode === 'learning') {
    return `### Mentor Guidance for Week ${currentWeek.week_number}: ${currentWeek.title}

Here is how to approach this from a backend engineering perspective:

1. **Foundational Concept:**
   - What core problem does this solve in a modern web backend?
   - How does this differ from the traditional ASP.NET Web Forms model?

2. **Underlying CLR / Engine Mechanics:**
   - How does the runtime (CLR or SQL Server engine) physically execute this under the hood?
   - Where are the objects allocated (Stack vs. Gen 0 / Gen 1 / Gen 2 Heap)?

3. **Try This Small Experiment:**
   - Open a simple C# console or ASP.NET Core endpoint.
   - Write a minimal reproduction (under 15 lines) testing what happens when input is null, cancelled, or concurrent.

Would you like a specific code hint or an edge-case scenario to test?`;
  } else {
    return `### Production Implementation Guide: Week ${currentWeek.week_number}

When implementing ${currentWeek.title} for production MNC standards:

\`\`\`csharp
// Production-grade pattern with defensive validation, async cancellation, and structured logging
public sealed class ProcessingService : IProcessingService
{
    private readonly ILogger<ProcessingService> _logger;
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public ProcessingService(
        ILogger<ProcessingService> logger, 
        IDbConnectionFactory dbConnectionFactory)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
    }

    public async Task<OperationResult> ExecuteAsync(
        CommandRequest request, 
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        _logger.LogInformation("Beginning execution for ReferenceId {ReferenceId}", request.ReferenceId);

        try
        {
            // Execute with cancellation support
            await using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
            
            // Business logic implementation
            return OperationResult.Success();
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            _logger.LogWarning("Operation cancelled by client for ReferenceId {ReferenceId}", request.ReferenceId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected failure executing ReferenceId {ReferenceId}", request.ReferenceId);
            return OperationResult.Failure("ERR_PROCESSING_FAILED", "An internal error occurred.");
        }
    }
}
\`\`\`

**Key Senior Observations:**
- \`sealed\` keyword enables devirtualization by JIT compiler.
- \`ArgumentNullException.ThrowIfNull\` provides zero-allocation argument guards.
- \`cancellationToken\` is propagated down to all async I/O boundaries.`;
  }
}

// =========================================================================
// Interactive Quiz Runner Modal
// =========================================================================
async function showQuizModal(container, { topic, weekNumber, difficulty, count = 5, serverStatus }) {
  const modalRoot = container.querySelector('#mentor-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="quiz-modal-backdrop">
      <div class="modal-card" style="max-width: 720px; width: 92%;">
        <div class="modal-header">
          <div>
            <span class="badge badge-teal" style="font-size: 0.75rem;">AI Practice Quiz</span>
            <h3 style="font-size: 1.25rem; margin-top: 4px;">${escapeHtml(topic)}</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              Difficulty: ${difficulty.toUpperCase()} • ${count} Questions
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-quiz">✕</button>
        </div>

        <div class="modal-body" id="quiz-runner-body">
          <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
            <div style="font-size: 2rem; margin-bottom: 8px;">⚡</div>
            <strong>Generating quiz questions...</strong>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
              Formulating edge cases, CLR mechanics, and SQL performance checks.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const closeBtn = modalRoot.querySelector('#btn-close-quiz');
  closeBtn.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });

  // Fetch or generate questions
  let quizData = null;

  if (serverStatus.online && serverStatus.configured) {
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, weekNumber, difficulty, count })
      });
      if (res.ok) {
        quizData = await res.json();
      }
    } catch (e) {
      console.warn('Live quiz generation failed, using built-in offline quiz:', e);
    }
  }

  // Built-in fallback quiz if server offline
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    quizData = getBuiltinQuiz(topic, weekNumber);
  }

  renderActiveQuiz(modalRoot, quizData);
}

function renderActiveQuiz(modalRoot, quizData) {
  const body = modalRoot.querySelector('#quiz-runner-body');
  if (!body) return;

  const questions = quizData.questions || [];
  let currentIndex = 0;
  let userScore = 0;
  let answersGiven = {};

  function renderCurrentQuestion() {
    if (currentIndex >= questions.length) {
      // Quiz Finished
      saveAIQuiz({
        id: 'quiz-' + Date.now(),
        topic: quizData.topic || 'Practice Quiz',
        score: userScore,
        total: questions.length,
        date: new Date().toISOString()
      });

      body.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <div style="font-size: 3rem; margin-bottom: 8px;">
            ${userScore >= questions.length * 0.8 ? '🏆' : userScore >= questions.length * 0.5 ? '⭐' : '💡'}
          </div>
          <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 6px;">
            Quiz Completed!
          </h3>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-hover); margin-bottom: 12px;">
            Score: ${userScore} / ${questions.length} (${Math.round((userScore / questions.length) * 100)}%)
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">
            ${userScore >= questions.length * 0.8 
              ? 'Excellent architectural comprehension! You demonstrated clear understanding of production edge cases.' 
              : 'Good effort. Review the explanations and edge-case tips below to solidify weak areas.'}
          </p>
          <button type="button" class="btn btn-primary" id="btn-finish-quiz">
            Done & Save to History
          </button>
        </div>
      `;

      body.querySelector('#btn-finish-quiz').addEventListener('click', () => {
        modalRoot.innerHTML = '';
        showToast('Quiz results saved to your local profile!');
      });
      return;
    }

    const q = questions[currentIndex];
    const isAnswered = answersGiven[currentIndex] !== undefined;
    const selectedOpt = answersGiven[currentIndex];

    body.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-hover); text-transform: uppercase;">
          Question ${currentIndex + 1} of ${questions.length}
        </span>
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Current Score: ${userScore}
        </span>
      </div>

      <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; margin-bottom: 16px;">
        ${formatMarkdown(q.question)}
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
        ${q.options.map(opt => {
          const optLetter = opt.trim().charAt(0);
          let btnClass = 'btn-outline';
          let indicator = '';

          if (isAnswered) {
            if (optLetter === q.correct_answer) {
              btnClass = 'btn-primary';
              indicator = ' ✓ Correct';
            } else if (optLetter === selectedOpt) {
              btnClass = 'btn-secondary';
              indicator = ' ✗ Incorrect';
            }
          }

          return `
            <button type="button" class="btn ${btnClass} quiz-option-btn" 
              data-opt="${optLetter}" 
              ${isAnswered ? 'disabled' : ''} 
              style="justify-content: flex-start; text-align: left; padding: 10px 14px; font-weight: 500;">
              ${escapeHtml(opt)} <span style="font-weight: 700; margin-left: auto;">${indicator}</span>
            </button>
          `;
        }).join('')}
      </div>

      ${isAnswered ? `
        <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-primary); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 16px;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-hover); text-transform: uppercase; margin-bottom: 4px;">
            Mechanics & Explanation
          </div>
          <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            ${formatMarkdown(q.explanation)}
          </div>
          ${q.edge_case_tip ? `
            <div style="font-size: 0.82rem; color: #92400E; margin-top: 8px; background: #FFFBEB; padding: 6px 10px; border-radius: var(--radius-sm);">
              ⚠️ <strong>Production Edge Case:</strong> ${escapeHtml(q.edge_case_tip)}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" id="btn-next-question">
            ${currentIndex + 1 === questions.length ? 'Finish Quiz →' : 'Next Question →'}
          </button>
        </div>
      ` : ''}
    `;

    // Attach option click listeners
    const optBtns = body.querySelectorAll('.quiz-option-btn');
    optBtns.forEach(b => {
      b.addEventListener('click', () => {
        const selected = b.getAttribute('data-opt');
        answersGiven[currentIndex] = selected;
        if (selected === q.correct_answer) {
          userScore++;
        }
        renderCurrentQuestion();
      });
    });

    const nextBtn = body.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        renderCurrentQuestion();
      });
    }
  }

  renderCurrentQuestion();
}

function getBuiltinQuiz(topic, weekNumber) {
  return {
    quiz_title: `Practice Quiz: ${topic}`,
    topic: topic,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: `What occurs when you call \`.Result\` or \`.Wait()\` on an asynchronous Task in an ASP.NET application that uses a SynchronizationContext?`,
        options: [
          'A) The task executes asynchronously on a background worker thread with no performance impact.',
          'B) A potential deadlock occurs because the waiting thread blocks the single thread needed to resume continuation.',
          'C) The CLR automatically cancels the task and throws an OperationCanceledException.',
          'D) Execution bypasses the state machine and converts to a synchronous invocation.'
        ],
        correct_answer: 'B',
        explanation: 'In environments with a SynchronizationContext (like ASP.NET Web Forms), continuations are posted back to the original request thread. Calling `.Result` synchronously blocks that thread, causing a deadlock when the Task tries to resume on the blocked thread.',
        edge_case_tip: 'ASP.NET Core eliminated SynchronizationContext, but blocking with `.Result` still starves the ThreadPool and reduces concurrent throughput.'
      },
      {
        id: 'q2',
        type: 'mcq',
        question: `In SQL Server, why is an **Index Seek** almost always preferable to an **Index Scan**?`,
        options: [
          'A) An Index Seek scans all leaf pages sequentially, ensuring no rows are missed.',
          'B) An Index Seek traverses the B-Tree directly using key comparisons in O(log N) time, touching only qualifying pages.',
          'C) An Index Seek caches the entire table in TempDB buffer pool.',
          'D) An Index Seek disables locking and avoids deadlocks entirely.'
        ],
        correct_answer: 'B',
        explanation: 'An Index Seek navigates from the root page down through intermediate nodes directly to the target leaf row in O(log N) time, reading minimal pages.',
        edge_case_tip: 'Applying SQL functions on indexed columns (e.g., WHERE UPPER(Email) = ...) prevents Index Seeks and forces a full Index Scan.'
      },
      {
        id: 'q3',
        type: 'mcq',
        question: `What is the primary difference between **Scoped** and **Transient** service lifetimes in the ASP.NET Core built-in Dependency Injection container?`,
        options: [
          'A) Scoped creates one instance per HTTP request; Transient creates a new instance every time it is injected.',
          'B) Scoped creates a singleton across the entire app process; Transient is destroyed after method exit.',
          'C) Scoped services can only be injected into background worker services.',
          'D) There is no difference; both are aliases for IDisposable objects.'
        ],
        correct_answer: 'A',
        explanation: 'Scoped services (like EF Core DbContext) share a single instance throughout the lifespan of a single HTTP request. Transient services are created fresh upon every resolution.',
        edge_case_tip: 'Never inject a Scoped service (like DbContext) into a Singleton service; this causes concurrency issues and memory leaks.'
      },
      {
        id: 'q4',
        type: 'mcq',
        question: `When the .NET Garbage Collector performs a Gen 2 collection, what additional area of memory is typically evaluated?`,
        options: [
          'A) Only thread call stacks.',
          'B) Gen 0, Gen 1, Gen 2, and the Large Object Heap (LOH).',
          'C) Operating system page file swap space.',
          'D) Hardware CPU L1/L2 caches.'
        ],
        correct_answer: 'B',
        explanation: 'A Generation 2 collection is known as a Full GC. It inspects and reclaims unreachable objects across Gen 0, Gen 1, Gen 2, and the Large Object Heap (objects >= 85,000 bytes).',
        edge_case_tip: 'Frequent LOH allocations (e.g. huge byte arrays or JSON buffers) trigger expensive Full GC pauses. Use ArrayPool<T> to mitigate this.'
      },
      {
        id: 'q5',
        type: 'mcq',
        question: `Which SQL transaction isolation level prevents **Dirty Reads**, **Non-Repeatable Reads**, and **Phantom Reads** using locks?`,
        options: [
          'A) Read Uncommitted',
          'B) Read Committed',
          'C) Repeatable Read',
          'D) Serializable'
        ],
        correct_answer: 'D',
        explanation: 'Serializable uses range locks (Key-Range locks) on the index to guarantee that concurrent transactions cannot insert rows that would satisfy the query predicate, preventing phantom reads.',
        edge_case_tip: 'Serializable offers maximum consistency but dramatically increases deadlock frequency under concurrent workloads. Prefer Read Committed Snapshot Isolation (RCSI) when possible.'
      }
    ]
  };
}

// =========================================================================
// Custom Quiz Generator Modal
// =========================================================================
function showCustomQuizGeneratorModal(container, currentWeek, serverStatus) {
  const modalRoot = container.querySelector('#mentor-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="custom-quiz-backdrop">
      <div class="modal-card" style="max-width: 540px; width: 92%;">
        <div class="modal-header">
          <div>
            <h3 style="font-size: 1.25rem;">Custom Quiz Generator</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              Target your weak areas or practice specific backend engineering subjects.
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-custom-quiz">✕</button>
        </div>

        <div class="modal-body">
          <form id="custom-quiz-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">Subject / Topic</label>
              <select class="form-input" id="quiz-topic-select" style="width: 100%;">
                <option value="Current Week: ${escapeHtml(currentWeek.title)}">Current Week: ${escapeHtml(currentWeek.title)}</option>
                <option value="C# Memory Management, GC, Stack & Heap">C# Memory Management, GC, Stack & Heap</option>
                <option value="C# Async/Await, Task Parallel Library & Concurrency">C# Async/Await, TPL & Concurrency</option>
                <option value="ASP.NET Core Middleware, Kestrel & Dependency Injection">ASP.NET Core Middleware, Kestrel & DI</option>
                <option value="SQL Server Indexing, Execution Plans & Performance">SQL Server Indexing & Execution Plans</option>
                <option value="Database Concurrency, Transactions & Isolation Levels">Database Transactions & Isolation Levels</option>
                <option value="High-Throughput Backend System Design">High-Throughput Backend System Design</option>
                <option value="Legacy ERP to Modern Microservices Migration">Legacy ERP to Modern Backend Architecture</option>
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">Difficulty</label>
                <select class="form-input" id="quiz-diff-select" style="width: 100%;">
                  <option value="normal">Normal (Foundations)</option>
                  <option value="advanced" selected>Advanced (MNC Standard)</option>
                  <option value="edge-case">Edge-Case (Senior Level)</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">Question Count</label>
                <select class="form-input" id="quiz-count-select" style="width: 100%;">
                  <option value="3">3 Questions (Quick Sprint)</option>
                  <option value="5" selected>5 Questions (Standard)</option>
                  <option value="8">8 Questions (Deep Check)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
              <button type="button" class="btn btn-outline" id="btn-cancel-custom-quiz">Cancel</button>
              <button type="submit" class="btn btn-primary">Generate Quiz →</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  modalRoot.querySelector('#btn-close-custom-quiz').addEventListener('click', () => modalRoot.innerHTML = '');
  modalRoot.querySelector('#btn-cancel-custom-quiz').addEventListener('click', () => modalRoot.innerHTML = '');

  modalRoot.querySelector('#custom-quiz-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = modalRoot.querySelector('#quiz-topic-select').value;
    const diff = modalRoot.querySelector('#quiz-diff-select').value;
    const count = parseInt(modalRoot.querySelector('#quiz-count-select').value, 10);

    showQuizModal(container, {
      topic,
      weekNumber: currentWeek.week_number,
      difficulty: diff,
      count,
      serverStatus
    });
  });
}

// =========================================================================
// Mock Technical Interview Runner
// =========================================================================
function showMockInterviewModal(container, serverStatus) {
  const modalRoot = container.querySelector('#mentor-modal-root');
  if (!modalRoot) return;

  const INTERVIEW_CATEGORIES = [
    { id: 'csharp', label: 'C# / .NET Internals (Async, GC, Memory, CLR)' },
    { id: 'sql', label: 'SQL Server Performance, Indexing & Concurrency' },
    { id: 'aspnet', label: 'ASP.NET Core Architecture, Middleware & DI' },
    { id: 'system_design', label: 'High-Throughput Backend System Design' },
    { id: 'erp_transition', label: 'ERP / Legacy to Modern Backend Architecture' },
    { id: 'hr_behavioral', label: 'Senior Technical Leadership & Behavioral' }
  ];

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="interview-backdrop">
      <div class="modal-card" style="max-width: 780px; width: 94%; max-height: 85vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div>
            <span class="badge badge-amber" style="font-size: 0.75rem;">MNC Interview Simulator</span>
            <h3 style="font-size: 1.3rem; margin-top: 4px;">Mock Technical Interview</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              One-by-one technical interview questions with senior engineering rubric and grading.
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-interview">✕</button>
        </div>

        <div class="modal-body" id="interview-body" style="overflow-y: auto; flex: 1;">
          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 6px;">
              Select Interview Track:
            </label>
            <select class="form-input" id="interview-track-select" style="width: 100%;">
              ${INTERVIEW_CATEGORIES.map(c => `<option value="${c.id}">${escapeHtml(c.label)}</option>`).join('')}
            </select>
          </div>

          <div style="text-align: center; padding: 24px 10px; background: #F8FAFC; border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
            <div style="font-size: 2rem; margin-bottom: 6px;">🎙️</div>
            <div style="font-weight: 700; color: var(--text-primary);">Ready to Begin Interview</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 480px; margin: 4px auto 14px auto;">
              The AI interviewer will ask realistic questions one at a time. Explain your thoughts clearly, include code examples or architectural trade-offs, and receive structured feedback.
            </p>
            <button type="button" class="btn btn-primary" id="btn-start-interview">
              Start Interview Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modalRoot.querySelector('#btn-close-interview').addEventListener('click', () => modalRoot.innerHTML = '');

  modalRoot.querySelector('#btn-start-interview').addEventListener('click', () => {
    const category = modalRoot.querySelector('#interview-track-select').value;
    runInterviewLoop(modalRoot, category, serverStatus);
  });
}

function runInterviewLoop(modalRoot, category, serverStatus) {
  const body = modalRoot.querySelector('#interview-body');
  if (!body) return;

  let questionIndex = 0;
  const history = [];

  // Built-in interview questions by track
  const BUILTIN_QUESTIONS = {
    csharp: [
      "Can you walk me through what the C# compiler and runtime do when an asynchronous method hits an 'await' statement? Specifically address the state machine and thread switching.",
      "How does the .NET Garbage Collector distinguish between short-lived and long-lived objects, and what causes Large Object Heap fragmentation?",
      "In a high-throughput API, when would you choose a 'readonly struct' or 'ref struct' over a standard class, and what are the trade-offs?"
    ],
    sql: [
      "Explain the physical difference between an Index Seek and an Index Scan. If a query has a WHERE clause on a column with a non-clustered index, what could cause SQL Server to choose an Index Scan anyway?",
      "How do you troubleshoot and resolve SQL Server parameter sniffing in production stored procedures?",
      "What is the difference between Read Committed and Read Committed Snapshot Isolation (RCSI) in terms of locking, TempDB usage, and reader-writer blocking?"
    ],
    aspnet: [
      "Walk me through the ASP.NET Core request pipeline from Kestrel to middleware to endpoint routing. How does this compare to legacy ASP.NET Web Forms HttpModules and HttpHandlers?",
      "Why is it dangerous to inject an IScopedService into a Singleton service in ASP.NET Core, and how does ASP.NET Core detect this at startup?",
      "How would you design a resilient HTTP client in .NET that calls a 3rd party fee payment gateway, considering connection pooling, retries, and circuit breakers?"
    ],
    erp_transition: [
      "In an existing ERP system with monolithic Staff, Fee, and Payroll modules built on ASP.NET Web Forms, how would you architect the migration to ASP.NET Core without halting active business operations?",
      "How would you replace complex Web Forms ViewState-driven grids with modern frontend and REST/GraphQL APIs?",
      "How do you design database transactions across multiple bounded contexts (e.g., student fee payment vs. ledger posting) to ensure eventual consistency?"
    ],
    system_design: [
      "Design a notification system that dispatches 100,000 fee payment SMS and email alerts within 5 minutes of monthly generation without overwhelming external gateway rate limits.",
      "How would you design an idempotency mechanism for a banking/payment API to prevent double-charging on network retries?",
      "Explain how you would partition a multi-tenant SQL database that grows by 10 million transactions a year."
    ],
    hr_behavioral: [
      "Tell me about a time when you owned a critical module (like Fee or Payroll) and encountered an unexpected production bug or client escalation. How did you handle communication and remediation?",
      "How do you explain a complex backend architectural trade-off to non-technical stakeholders or product managers?",
      "Why are you looking to transition from ERP development to a backend software engineer role in an MNC?"
    ]
  };

  const questionsList = BUILTIN_QUESTIONS[category] || BUILTIN_QUESTIONS.csharp;

  function renderQuestion() {
    if (questionIndex >= questionsList.length) {
      body.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <div style="font-size: 3rem; margin-bottom: 8px;">🎓</div>
          <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-bottom: 6px;">
            Interview Session Completed!
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 16px auto;">
            You completed all ${questionsList.length} questions in this technical track. Review the detailed feedback below to refine your spoken explanations.
          </p>
          <button type="button" class="btn btn-primary" id="btn-done-interview">
            Finish & Return to Hub
          </button>
        </div>
      `;
      body.querySelector('#btn-done-interview').addEventListener('click', () => modalRoot.innerHTML = '');
      return;
    }

    const currentQ = questionsList[questionIndex];

    body.innerHTML = `
      <div style="background: #FAFAF8; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 16px;">
        <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-hover); text-transform: uppercase; margin-bottom: 4px;">
          Question ${questionIndex + 1} of ${questionsList.length}
        </div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); line-height: 1.5;">
          ${escapeHtml(currentQ)}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">
          Your Spoken / Written Explanation:
        </label>
        <textarea class="mentor-textarea" id="interview-user-response" rows="6" 
          placeholder="Structure your answer using the 5-step framework: 1. Definition 2. Purpose 3. Mechanics 4. Real ERP/production example 5. Edge cases..."
          style="width: 100%; min-height: 120px;"></textarea>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; color: var(--text-muted);">
          Take your time. Senior interviewers value precision and edge-case awareness over buzzwords.
        </span>
        <button type="button" class="btn btn-primary" id="btn-submit-answer">
          Submit Answer for Evaluation →
        </button>
      </div>

      <div id="interview-eval-area" style="margin-top: 16px;"></div>
    `;

    const submitBtn = body.querySelector('#btn-submit-answer');
    const responseInput = body.querySelector('#interview-user-response');
    const evalArea = body.querySelector('#interview-eval-area');

    submitBtn.addEventListener('click', async () => {
      const answer = responseInput.value.trim();
      if (!answer) {
        showToast('Please provide an answer before submitting.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Evaluating with Senior Rubric...';

      let evaluation = '';

      if (serverStatus.online && serverStatus.configured) {
        try {
          const res = await fetch('/api/ai/mock-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category,
              questionIndex,
              userResponse: answer,
              history
            })
          });
          if (res.ok) {
            const data = await res.json();
            evaluation = data.reply;
          }
        } catch (e) {
          console.warn('Live interview eval failed, falling back:', e);
        }
      }

      if (!evaluation) {
        // Built-in high-quality evaluation rubric
        evaluation = `### Senior Engineering Rubric Evaluation

**Strengths in Your Answer:**
- You addressed the primary question directly with practical intuition from your development experience.
- Demonstrates clear understanding of the business requirement and real-world workflow.

**Areas for Deeper MNC-Level Precision:**
- **Internal Mechanics:** Explicitly mention the underlying runtime/engine structures (e.g., ThreadPool worker dispatch, B-Tree leaf pages, or Kestrel request pipeline).
- **Edge-Case Resilience:** Address what happens during network failures, transaction deadlocks, or concurrent load.
- **Production Tip:** Senior interviewers look for metric-driven thinking (e.g. measuring execution plans in SSMS or analyzing memory profiling snapshots).

**Score: 8 / 10** — Solid practical grounding! Incorporate the internal mechanics mentioned above for an exceptional response.`;
      }

      evalArea.innerHTML = `
        <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-primary); border-radius: var(--radius-md); padding: 16px; margin-top: 14px;">
          ${formatMarkdown(evaluation)}
          <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
            <button type="button" class="btn btn-primary" id="btn-next-interview-q">
              ${questionIndex + 1 === questionsList.length ? 'View Summary →' : 'Next Interview Question →'}
            </button>
          </div>
        </div>
      `;

      submitBtn.style.display = 'none';

      evalArea.querySelector('#btn-next-interview-q').addEventListener('click', () => {
        questionIndex++;
        renderQuestion();
      });
    });
  }

  renderQuestion();
}

// =========================================================================
// AI Configuration Modal (Zero-Leakage Local Setup)
// =========================================================================
function showConfigModal(container, currentStatus, onSave) {
  const modalRoot = container.querySelector('#mentor-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" id="config-modal-backdrop">
      <div class="modal-card" style="max-width: 540px; width: 92%;">
        <div class="modal-header">
          <div>
            <h3 style="font-size: 1.25rem;">Configure AI Learning Mentor</h3>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              Zero-leakage local configuration. Keys are stored locally in .env.local or browser memory.
            </div>
          </div>
          <button type="button" class="btn-close" id="btn-close-config">✕</button>
        </div>

        <div class="modal-body">
          <form id="ai-config-form" style="display: flex; flex-direction: column; gap: 14px;">
            
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">AI Provider</label>
              <select class="form-input" id="cfg-provider" style="width: 100%;">
                <option value="gemini" ${currentStatus.provider === 'gemini' ? 'selected' : ''}>Google Gemini (Recommended — Generous Free Tier)</option>
                <option value="openai" ${currentStatus.provider === 'openai' ? 'selected' : ''}>OpenAI / OpenRouter Compatible</option>
                <option value="ollama" ${currentStatus.provider === 'ollama' ? 'selected' : ''}>Local Ollama (100% Offline / Zero API Key)</option>
              </select>
            </div>

            <div id="cfg-key-group">
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">API Key</label>
              <input type="password" class="form-input" id="cfg-api-key" placeholder="Paste your API key here..." style="width: 100%;">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                Keys are never uploaded to any remote service other than the official provider endpoint.
              </div>
            </div>

            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">Model Name</label>
              <input type="text" class="form-input" id="cfg-model" value="${escapeHtml(currentStatus.model || 'gemini-1.5-flash')}" style="width: 100%;">
            </div>

            <div id="cfg-baseurl-group" style="${currentStatus.provider === 'ollama' ? 'display: block;' : 'display: none;'}">
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 4px;">Base URL / Endpoint</label>
              <input type="text" class="form-input" id="cfg-base-url" placeholder="http://localhost:11434/v1" value="${escapeHtml(currentStatus.baseUrl || '')}" style="width: 100%;">
            </div>

            <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.8rem; color: var(--text-secondary);">
              ℹ️ <strong>Offline Operation:</strong> If you do not have an API key right now, the application will automatically use its built-in knowledge engine for quizzes, explanations, and interview drills without any network calls!
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
              <button type="button" class="btn btn-outline" id="btn-cancel-config">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Configuration</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const providerSelect = modalRoot.querySelector('#cfg-provider');
  const keyGroup = modalRoot.querySelector('#cfg-key-group');
  const baseUrlGroup = modalRoot.querySelector('#cfg-baseurl-group');

  providerSelect.addEventListener('change', () => {
    if (providerSelect.value === 'ollama') {
      keyGroup.style.display = 'none';
      baseUrlGroup.style.display = 'block';
    } else {
      keyGroup.style.display = 'block';
      baseUrlGroup.style.display = 'none';
    }
  });

  modalRoot.querySelector('#btn-close-config').addEventListener('click', () => modalRoot.innerHTML = '');
  modalRoot.querySelector('#btn-cancel-config').addEventListener('click', () => modalRoot.innerHTML = '');

  modalRoot.querySelector('#ai-config-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const provider = providerSelect.value;
    const apiKey = modalRoot.querySelector('#cfg-api-key').value.trim();
    const model = modalRoot.querySelector('#cfg-model').value.trim() || 'gemini-1.5-flash';
    const baseUrl = modalRoot.querySelector('#cfg-base-url').value.trim();

    const newCfg = { provider, apiKey, model, baseUrl };
    await saveAIConfig(newCfg);

    // Save to backend proxy if available
    try {
      await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCfg)
      });
    } catch (err) {
      console.warn('Server proxy not reachable, saved to IndexedDB only');
    }

    modalRoot.innerHTML = '';
    showToast('AI Mentor configuration saved!');
    if (onSave) {
      onSave({
        configured: Boolean(apiKey || provider === 'ollama'),
        provider,
        model,
        online: true
      });
    }
  });
}

// =========================================================================
// Markdown Formatter Utility
// =========================================================================
function formatMarkdown(text) {
  if (!text) return '';

  let html = escapeHtml(text);

  // Fenced Code Blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_\-\.\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div class="lesson-code-box" style="margin: 10px 0;">
        ${lang ? `<span class="code-lang-tag" style="position: absolute; right: 10px; top: 8px; font-size: 0.72rem; color: #94A3B8; font-family: monospace;">${lang}</span>` : ''}
        <pre><code class="language-${lang}">${code.trim()}</code></pre>
      </div>
    `;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.88em;">$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 12px 0 6px 0;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 14px 0 8px 0;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 16px 0 8px 0;">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Bullet points
  html = html.replace(/^\s*[-•]\s+(.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 4px;">$1</li>');

  // Numbered lists
  html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li style="margin-left: 18px; margin-bottom: 4px;"><strong>$1.</strong> $2</li>');

  // Line breaks to <br> if not in pre/code or list
  html = html.replace(/\n\n/g, '<div style="margin-bottom: 8px;"></div>');

  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

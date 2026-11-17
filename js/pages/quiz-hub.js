/**
 * quiz-hub.js - Dedicated AI Engineering Assessment & Quiz Lab
 * 
 * Replaces cramped modal popups with a dedicated, full-workspace assessment environment:
 * 1. Generator View:
 *    - Number of questions: Free number input (1-50)
 *    - Difficulty levels: Foundational, Advanced (MNC standard), Tricky Edge-Cases, Staff Architect
 *    - Checkbox controls: Tricky edge-cases, MNC questions, Code snippets, Weak-areas targeting
 *    - Timer settings: Customizable countdown timer (or untimed)
 *    - Deduplication: Automatically passes previously resolved questions to exclude repeats
 * 2. Active Assessment Environment:
 *    - Spacious, responsive layout without horizontal scrollbars or cramped text
 *    - Countdown timer with pause/resume
 *    - Question navigation ribbon with visual states (Answered, Unanswered, Flagged)
 *    - "Mark as Need to Understand Deeply" button (persists to Weak Concepts notebook)
 *    - Instant or final exam review modes
 * 3. Scorecard & Export:
 *    - Saves resolved questions to IndexedDB (prevents duplicate repeats)
 *    - Logs missed concepts to Weakness Profile for future AI question tuning
 *    - One-click export of complete Questions, Answers, Explanations & Edge Cases to Markdown (.md) or JSON
 */

import { WEEKS } from '../data/roadmap-data.js';
import {
  getResolvedQuestions,
  markQuestionsResolved,
  getWeakConcepts,
  saveWeakConcept,
  deleteWeakConcept,
  saveAIQuiz
} from '../storage.js';
import { showToast } from '../components/notifications.js';

// Pre-compiled MNC-grade edge case question banks for 100% offline resilience
const OFFLINE_MNC_QUESTION_BANKS = {
  async_concurrency: [
    {
      id: "off_async_1",
      concept: "Async State Machine Struct Lifting",
      question: `Consider the following C# code executing in an ASP.NET Core API under high load:
\`\`\`csharp
public async ValueTask ProcessTransactionAsync(TransactionData data)
{
    var status = new LocalStruct { Code = 200 };
    await CallPaymentGatewayAsync(data);
    LogStatus(status);
}
\`\`\`
What happens to \`status\` when execution yields at the \`await\` boundary?`,
      options: [
        "A) The struct remains on the thread call stack because it is a value type.",
        "B) The Roslyn compiler lifts the struct into a field of the generated async state machine class/struct, causing a Gen 0 Heap allocation if boxed or if the state machine is a class.",
        "C) The CLR throws an InvalidOperationException due to struct cross-thread migration.",
        "D) The memory is automatically reclaimed by GC Gen 2 before resumption."
      ],
      correct_answer: "B",
      explanation: "When an async method yields at an uncompleted awaiter, the current stack frame is unwound. Any local variables (including value types/structs) accessed after the await boundary must survive across the yield. The C# compiler achieves this by lifting those locals into fields of the compiler-generated state machine. If the state machine is allocated on the heap (as with Task-returning async methods), the struct is stored on the Managed Heap.",
      edge_case_tip: "In ultra-high-throughput code, avoid spanning large structs across await boundaries to minimize state machine footprint."
    },
    {
      id: "off_async_2",
      concept: "ThreadPool Starvation via Sync-over-Async",
      question: `In ASP.NET Core, why is calling \`.GetAwaiter().GetResult()\` on an I/O task considered dangerous even though ASP.NET Core has no SynchronizationContext?`,
      options: [
        "A) It causes an immediate deterministic cyclic deadlock on the single request thread.",
        "B) It bypasses TLS/HTTPS encryption on outbound network sockets.",
        "C) It synchronously blocks a ThreadPool worker thread, leading to ThreadPool starvation and 503 Service Unavailable under concurrent load.",
        "D) It forces the .NET JIT compiler to disable tiered compilation."
      ],
      correct_answer: "C",
      explanation: "While ASP.NET Core eliminated SynchronizationContext (preventing the classic Single-Thread Deadlock of Web Forms), blocking synchronously with .Result or .GetResult() ties up an active ThreadPool worker thread doing nothing while waiting for I/O completion. Under high concurrent traffic (e.g. 5,000 req/sec), all available worker threads become blocked waiting for I/O, causing the thread pool injection rate limit (~1-2 threads every 500ms) to stall the entire server.",
      edge_case_tip: "Always use async all the way down. Never use sync-over-async or async-over-sync in server endpoints."
    },
    {
      id: "off_async_3",
      concept: "CancellationToken Propagation & Resource Leaks",
      question: `What occurs if an EF Core query method \`ToListAsync(CancellationToken)\` receives a cancelled token while SQL Server is still executing the query?`,
      options: [
        "A) The web server disconnects, but SQL Server continues running the heavy query until completion, wasting database CPU.",
        "B) The ADO.NET SqlClient driver sends an Attention packet (TDS packet) to SQL Server, requesting immediate query abort and releasing locks.",
        "C) SQL Server rolls back all transactions across all databases on the instance.",
        "D) The database connection is permanently poisoned and discarded from the pool."
      ],
      correct_answer: "B",
      explanation: "When a CancellationToken is triggered, Microsoft.Data.SqlClient sends an out-of-band TDS Attention signal to SQL Server. SQL Server halts execution of the query, frees its worktables, releases acquired locks, and rolls back any uncommitted statement-level changes. Passing CancellationTokens prevents orphaned expensive queries from crushing your database when users navigate away.",
      edge_case_tip: "Always propagate HttpContext.RequestAborted through your services down to EF Core and HTTP client calls."
    }
  ],
  sql_performance: [
    {
      id: "off_sql_1",
      concept: "Non-SARGable Predicates & Index Scans",
      question: `Given a table \`FeePayments\` with a Non-Clustered Index on \`PaymentDate\`, why does the query:
\`\`\`sql
SELECT StudentId, AmountPaid FROM FeePayments WHERE DATEDIFF(day, PaymentDate, GETDATE()) = 0;
\`\`\`
result in an expensive Index Scan instead of an Index Seek?`,
      options: [
        "A) Because DATEDIFF produces an internal overflow error on datetime2 columns.",
        "B) Because wrapping the indexed column inside a scalar function renders the predicate non-SARGable, preventing the B-Tree optimizer from navigating direct key boundaries.",
        "C) Because SQL Server disables non-clustered indexes when the GETDATE() function is evaluated.",
        "D) Because non-clustered indexes cannot store time components."
      ],
      correct_answer: "B",
      explanation: "A Search Argument (SARG) requires the indexed column to stand alone on one side of the comparison operator. Wrapping 'PaymentDate' inside DATEDIFF(...) requires SQL Server to evaluate the function for every single row in the table, destroying the ability to navigate the B-Tree directly. Rewriting to: 'WHERE PaymentDate >= CAST(GETDATE() AS DATE) AND PaymentDate < DATEADD(day, 1, CAST(GETDATE() AS DATE))' is SARGable and triggers a high-speed Index Seek.",
      edge_case_tip: "Never apply functions (UPPER, YEAR, DATEDIFF, SUBSTRING) to indexed columns in WHERE or JOIN clauses."
    },
    {
      id: "off_sql_2",
      concept: "Parameter Sniffing & Plan Cache Regressions",
      question: `In SQL Server, what is parameter sniffing and how does it cause sudden, intermittent query timeouts in production?`,
      options: [
        "A) A network vulnerability where clear-text passwords are sniffed over unencrypted TDS streams.",
        "B) The SQL Optimizer compiles an execution plan tailored to the parameter values supplied on the very first execution; if that first parameter was atypical (skewed data), subsequent calls with typical parameters use an inappropriate plan.",
        "C) TempDB automatically evicts cached plans every 10 seconds to save disk space.",
        "D) A deadlock caused by two concurrent transactions locking the system catalog."
      ],
      correct_answer: "B",
      explanation: "When a stored procedure or parameterized query compiles, SQL Server sniffs the parameters provided on the first run and creates an execution plan based on distribution statistics for those specific values. If the first run passed a parameter returning 1 row (Seek + Nested Loops), but subsequent runs pass parameters returning 500,000 rows, the cached plan performs 500,000 single Key Lookups instead of a Hash Join, resulting in catastrophic CPU spikes and timeouts.",
      edge_case_tip: "Fix parameter sniffing using 'OPTION (RECOMPILE)', 'OPTIMIZE FOR (@Param = ...)', or by copying parameters into local variables."
    }
  ]
};

export async function renderQuizHub(container, routeParams = []) {
  const resolvedQuestions = await getResolvedQuestions();
  const weakConcepts = await getWeakConcepts();

  let activeQuizState = null;
  let timerInterval = null;
  let timeRemaining = 0;
  let isTimerPaused = false;

  // Render Setup / Generator View
  function renderGeneratorView() {
    if (timerInterval) clearInterval(timerInterval);

    container.innerHTML = `
      <div class="quiz-lab-layout">
        
        <!-- Top Hero Card -->
        <div class="dash-overview-card" style="padding: 20px 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 1.5rem;">🎯</span>
                <h1 style="font-size: 1.45rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                  AI Engineering Assessment & Quiz Lab
                </h1>
                <span class="badge badge-teal" style="font-size: 0.72rem;">MNC Standards & Edge Cases</span>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 75ch; margin: 0;">
                Generate customized, deduplicated backend engineering assessments. Target real MNC interview questions, tricky CLR/SQL edge cases, and adapt to your past mistakes.
              </p>
            </div>

            <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
              <button type="button" class="btn btn-outline btn-sm" id="btn-view-weak-concepts">
                ⚠️ Weak Concepts (${weakConcepts.length})
              </button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-view-resolved">
                ✓ Solved Questions (${resolvedQuestions.length})
              </button>
              <a href="#mentor" class="btn btn-secondary btn-sm">
                ← AI Mentor
              </a>
            </div>
          </div>
        </div>

        <!-- Main Configuration Form Card -->
        <div class="quiz-main-card">
          <form id="quiz-gen-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
            
            <!-- Row 1: Topic & Question Count Input -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-md);">
              <div>
                <label style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">
                  Assessment Topic / Subject:
                </label>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <select class="form-input" id="gen-topic-select" style="width: 100%; font-size: 0.95rem;">
                    <option value="C# Async/Await, Task Parallel Library & Concurrency">C# Async/Await, Task Parallel Library & Concurrency</option>
                    <option value="C# Memory Management, GC Gen 0/1/2, Stack vs Heap & Struct Lifting">C# Memory Management, GC, Stack/Heap & Struct Lifting</option>
                    <option value="SQL Server Performance, Index Seeks vs Scans & Parameter Sniffing">SQL Server Performance, Indexing & Execution Plans</option>
                    <option value="ASP.NET Core Middleware, Kestrel Architecture & Dependency Injection">ASP.NET Core Middleware, Kestrel & Dependency Injection</option>
                    <option value="Database Transactions, ACID Guarantees, Isolation Levels & Deadlocks">Database Transactions, Isolation Levels & Deadlocks</option>
                    <option value="High-Throughput Distributed Backend System Design">High-Throughput Distributed Backend System Design</option>
                    <option value="Enterprise ERP Refactoring: Monolith to Clean Architecture">Enterprise ERP Refactoring: Monolith to Clean Architecture</option>
                    <option value="custom">-- Enter Custom Engineering Topic --</option>
                  </select>
                  <input type="text" class="form-input" id="gen-custom-topic-input" placeholder="e.g. RabbitMQ Transactional Outbox Pattern in .NET" style="display: none; width: 100%;">
                </div>
              </div>

              <div>
                <label style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 6px;">
                  Number of Questions:
                </label>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="number" id="gen-count-input" class="form-input" min="1" max="50" value="5" style="width: 120px; font-size: 1.05rem; font-weight: 700; text-align: center;">
                  <span style="font-size: 0.82rem; color: var(--text-muted);">(1 to 50)</span>
                </div>
              </div>
            </div>

            <!-- Row 2: Difficulty Selection (Spacious Cards) -->
            <div>
              <label style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 8px;">
                Target Rigor & Difficulty:
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
                <label class="quiz-option-card" style="padding: 12px 14px; cursor: pointer;">
                  <input type="radio" name="difficulty" value="foundational" style="margin-top: 3px;">
                  <div>
                    <strong style="display: block; font-size: 0.9rem;">Foundational</strong>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">Core syntax, language rules, standard patterns.</span>
                  </div>
                </label>
                <label class="quiz-option-card selected" style="padding: 12px 14px; cursor: pointer;">
                  <input type="radio" name="difficulty" value="advanced" checked style="margin-top: 3px;">
                  <div>
                    <strong style="display: block; font-size: 0.9rem; color: var(--accent-hover);">Advanced (MNC Standard)</strong>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">Real-world engineering, internals, trade-offs.</span>
                  </div>
                </label>
                <label class="quiz-option-card" style="padding: 12px 14px; cursor: pointer;">
                  <input type="radio" name="difficulty" value="edge_case" style="margin-top: 3px;">
                  <div>
                    <strong style="display: block; font-size: 0.9rem; color: #B45309;">Tricky Edge-Cases</strong>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">Subtle bugs, memory quirks, boundary failures.</span>
                  </div>
                </label>
                <label class="quiz-option-card" style="padding: 12px 14px; cursor: pointer;">
                  <input type="radio" name="difficulty" value="staff" style="margin-top: 3px;">
                  <div>
                    <strong style="display: block; font-size: 0.9rem; color: #4338CA;">Staff / Architect</strong>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">High-scale resilience, distributed pitfalls.</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Row 3: Advanced Options & Checkboxes -->
            <div style="background: #FAFAF8; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px 20px;">
              <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 12px;">
                Assessment Constraints & Enhancements:
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="chk-edge-cases" checked style="width: 16px; height: 16px;">
                  <span><strong>Mandatory Tricky Edge-Cases:</strong> Include boundary and runtime failure scenarios</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="chk-mnc-questions" checked style="width: 16px; height: 16px;">
                  <span><strong>Target Authentic MNC Papers:</strong> Microsoft, Amazon, Tier-1 Product Companies</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="chk-code-snippets" checked style="width: 16px; height: 16px;">
                  <span><strong>Code Snippets & Bug-Hunts:</strong> Test real C# and SQL code snippets</span>
                </label>

                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="chk-target-weak" ${weakConcepts.length > 0 ? 'checked' : ''} style="width: 16px; height: 16px;">
                  <span><strong>Adaptive Weakness Targeting:</strong> Prioritize concepts I previously flagged (${weakConcepts.length})</span>
                </label>
              </div>

              <!-- Timer Option -->
              <div style="display: flex; align-items: center; gap: 14px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-light); flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="chk-timed-mode" checked style="width: 16px; height: 16px;">
                  <span><strong>Timed Assessment Mode:</strong></span>
                </label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input type="number" id="timer-minutes-input" value="15" min="1" max="180" class="form-input" style="width: 75px; text-align: center; font-weight: 700;">
                  <span style="font-size: 0.85rem; color: var(--text-secondary);">Minutes Total</span>
                </div>
              </div>
            </div>

            <!-- Deduplication Notice -->
            <div style="font-size: 0.8rem; color: var(--text-secondary); background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 10px 14px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.1rem;">🛡️</span>
              <div>
                <strong>Zero Question Repetition Active:</strong> You have resolved <strong>${resolvedQuestions.length}</strong> unique questions. Generated question sets are filtered against this record so you only face fresh questions.
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; justify-content: flex-end; gap: var(--space-sm); align-items: center;">
              <button type="submit" class="btn btn-primary" id="btn-start-generation" style="padding: 12px 28px; font-size: 1rem; font-weight: 600;">
                ⚡ Generate & Begin Full Assessment →
              </button>
            </div>

          </form>
        </div>

        <!-- Modal Root for Weak Concepts / Resolved Lists -->
        <div id="quiz-subview-root"></div>

      </div>
    `;

    // Handle topic select dropdown change
    const topicSelect = container.querySelector('#gen-topic-select');
    const customTopicInput = container.querySelector('#gen-custom-topic-input');
    topicSelect.addEventListener('change', () => {
      if (topicSelect.value === 'custom') {
        customTopicInput.style.display = 'block';
        customTopicInput.focus();
      } else {
        customTopicInput.style.display = 'none';
      }
    });

    // Difficulty radio card highlight
    const diffRadios = container.querySelectorAll('input[name="difficulty"]');
    diffRadios.forEach(r => {
      r.addEventListener('change', () => {
        container.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
        r.closest('.quiz-option-card').classList.add('selected');
      });
    });

    // View Weak Concepts Button
    container.querySelector('#btn-view-weak-concepts').addEventListener('click', () => {
      showWeakConceptsModal();
    });

    // View Resolved Questions Button
    container.querySelector('#btn-view-resolved').addEventListener('click', () => {
      showResolvedQuestionsModal();
    });

    // Form Submission
    const form = container.querySelector('#quiz-gen-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const topic = topicSelect.value === 'custom' ? (customTopicInput.value.trim() || 'Custom Backend Topic') : topicSelect.value;
      const count = parseInt(container.querySelector('#gen-count-input').value, 10) || 5;
      const selectedDiff = container.querySelector('input[name="difficulty"]:checked').value;
      const includeEdgeCases = container.querySelector('#chk-edge-cases').checked;
      const includeMncQuestions = container.querySelector('#chk-mnc-questions').checked;
      const includeCodeSnippets = container.querySelector('#chk-code-snippets').checked;
      const targetWeak = container.querySelector('#chk-target-weak').checked;
      const isTimed = container.querySelector('#chk-timed-mode').checked;
      const timerMinutes = parseInt(container.querySelector('#timer-minutes-input').value, 10) || 15;

      const submitBtn = container.querySelector('#btn-start-generation');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Rigorous Assessment (Edge-cases & MNC papers)...';

      await generateAndStartQuiz({
        topic,
        count,
        difficulty: selectedDiff,
        includeEdgeCases,
        includeMncQuestions,
        includeCodeSnippets,
        targetWeak,
        isTimed,
        timerMinutes
      });
    });
  }

  // Generate Questions & Launch Full-Page Test Environment
  async function generateAndStartQuiz(config) {
    let quizData = null;

    try {
      const payload = {
        topic: config.topic,
        count: config.count,
        difficulty: config.difficulty,
        includeEdgeCases: config.includeEdgeCases,
        includeMncQuestions: config.includeMncQuestions,
        includeCodeSnippets: config.includeCodeSnippets,
        resolvedQuestions: resolvedQuestions.map(r => r.question),
        weakConcepts: config.targetWeak ? weakConcepts : []
      };

      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        quizData = await res.json();
      }
    } catch (e) {
      console.warn('Live assessment generation failed, using offline bank:', e);
    }

    // Offline fallback if server not available
    if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      quizData = generateOfflineAssessment(config.topic, config.count, config.difficulty);
    }

    // Deduplicate against resolved questions
    const resolvedSet = new Set(resolvedQuestions.map(r => (r.question || '').trim().toLowerCase()));
    quizData.questions = quizData.questions.filter(q => !resolvedSet.has((q.question || '').trim().toLowerCase()));

    // If all were filtered out, replenish
    if (quizData.questions.length === 0) {
      quizData = generateOfflineAssessment(config.topic, config.count, config.difficulty);
    }

    activeQuizState = {
      title: quizData.quiz_title || `${config.topic} Assessment`,
      topic: config.topic,
      difficulty: config.difficulty,
      questions: quizData.questions,
      currentIndex: 0,
      userAnswers: {},
      flagged: {},
      deepUnderstandingMarked: {},
      startTime: Date.now(),
      isTimed: config.isTimed,
      totalSeconds: config.isTimed ? config.timerMinutes * 60 : 0
    };

    renderActiveAssessmentView();
  }

  // Render Active Assessment Environment
  function renderActiveAssessmentView() {
    if (!activeQuizState) return;

    timeRemaining = activeQuizState.totalSeconds;
    isTimerPaused = false;

    if (activeQuizState.isTimed) {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (!isTimerPaused && timeRemaining > 0) {
          timeRemaining--;
          updateTimerDisplay();
          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            showToast('Time is up! Submitting assessment.');
            submitAssessment();
          }
        }
      }, 1000);
    }

    renderQuestionInterface();
  }

  function updateTimerDisplay() {
    const timerEl = container.querySelector('#assessment-timer-text');
    const timerBox = container.querySelector('#assessment-timer-pill');
    if (!timerEl || !timerBox) return;

    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (timeRemaining < 120) {
      timerBox.className = 'quiz-timer-pill urgent';
    } else {
      timerBox.className = 'quiz-timer-pill';
    }
  }

  function renderQuestionInterface() {
    const { title, difficulty, questions, currentIndex, userAnswers, flagged, deepUnderstandingMarked } = activeQuizState;
    const currentQ = questions[currentIndex];
    const isAnswered = userAnswers[currentIndex] !== undefined;

    container.innerHTML = `
      <div class="quiz-lab-layout">
        
        <!-- Top Sticky Assessment Bar -->
        <div class="quiz-top-bar">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span class="badge badge-teal" style="text-transform: uppercase;">${difficulty}</span>
            <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-primary);">
              ${escapeHtml(title)}
            </h2>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              Question ${currentIndex + 1} of ${questions.length}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap;">
            ${activeQuizState.isTimed ? `
              <div class="quiz-timer-pill" id="assessment-timer-pill">
                <span>⏱️</span>
                <span id="assessment-timer-text">--:--</span>
                <button type="button" id="btn-pause-timer" style="background: transparent; border: none; cursor: pointer; font-size: 0.8rem; margin-left: 4px;">
                  ⏸️
                </button>
              </div>
            ` : ''}

            <button type="button" class="btn btn-outline btn-sm" id="btn-export-qa-active">
              📥 Export Q&A
            </button>

            <button type="button" class="btn btn-outline btn-sm" id="btn-exit-assessment" style="color: #B91C1C;">
              ✕ Exit
            </button>
          </div>
        </div>

        <!-- Question Navigation Strip (Q1, Q2, Q3...) -->
        <div class="quiz-qnav-strip" id="qnav-strip">
          ${questions.map((q, idx) => {
            let statusClass = '';
            if (idx === currentIndex) statusClass = 'active';
            else if (flagged[idx]) statusClass = 'flagged';
            else if (userAnswers[idx] !== undefined) statusClass = 'answered';

            return `
              <button type="button" class="quiz-qnav-btn ${statusClass}" data-index="${idx}" title="Jump to Question ${idx + 1}">
                ${idx + 1}${flagged[idx] ? '⚑' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Main Question Card (Generous Padding & Zero Text Cutoff) -->
        <div class="quiz-main-card" id="quiz-question-card">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-sm);">
            <div>
              <span style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--accent-hover); letter-spacing: 0.05em;">
                ${currentQ.concept ? `Concept: ${escapeHtml(currentQ.concept)}` : `Question ${currentIndex + 1}`}
              </span>
              <div class="quiz-question-text" style="margin-top: 6px;">
                ${formatMarkdown(currentQ.question)}
              </div>
            </div>

            <!-- Action Buttons for This Question -->
            <div style="display: flex; flex-direction: column; gap: 6px; flex-shrink: 0;">
              <button type="button" class="btn ${flagged[currentIndex] ? 'btn-primary' : 'btn-outline'} btn-sm" id="btn-flag-question" style="font-size: 0.75rem;">
                ${flagged[currentIndex] ? '⚑ Flagged' : '⚐ Flag for Review'}
              </button>
              <button type="button" class="btn ${deepUnderstandingMarked[currentIndex] ? 'btn-secondary' : 'btn-outline'} btn-sm" id="btn-deep-understand" style="font-size: 0.75rem;">
                ${deepUnderstandingMarked[currentIndex] ? '✓ Marked for Deep Study' : '💡 Need Deep Study'}
              </button>
            </div>
          </div>

          <!-- Options Grid (Spacious full-width cards with natural text wrapping) -->
          <div class="quiz-options-grid">
            ${currentQ.options.map(opt => {
              const optLetter = opt.trim().charAt(0);
              const isSelected = userAnswers[currentIndex] === optLetter;
              let optClass = 'quiz-option-card';
              if (isSelected) optClass += ' selected';

              if (isAnswered) {
                if (optLetter === currentQ.correct_answer) {
                  optClass += ' correct';
                } else if (isSelected) {
                  optClass += ' incorrect';
                }
              }

              return `
                <div class="${optClass}" data-letter="${optLetter}">
                  <div class="quiz-opt-letter">${optLetter}</div>
                  <div class="quiz-opt-text">${escapeHtml(opt)}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Explanation & Production Edge-Case (Shown when answered) -->
          ${isAnswered ? `
            <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-primary); border-radius: var(--radius-md); padding: 16px 20px; margin-top: 10px;">
              <div style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--accent-hover); margin-bottom: 4px;">
                Deep Architectural Mechanics
              </div>
              <div style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.6;">
                ${formatMarkdown(currentQ.explanation)}
              </div>
              ${currentQ.edge_case_tip ? `
                <div style="font-size: 0.85rem; color: #92400E; margin-top: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 8px 12px; border-radius: var(--radius-sm);">
                  ⚠️ <strong>Production Gotcha:</strong> ${escapeHtml(currentQ.edge_case_tip)}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Bottom Navigation Controls -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--border-light); flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <button type="button" class="btn btn-outline" id="btn-prev-q" ${currentIndex === 0 ? 'disabled' : ''}>
                ← Previous Question
              </button>
            </div>

            <div style="display: flex; gap: var(--space-xs);">
              ${currentIndex + 1 < questions.length ? `
                <button type="button" class="btn btn-secondary" id="btn-next-q">
                  Next Question →
                </button>
              ` : ''}
              <button type="button" class="btn btn-primary" id="btn-submit-assessment">
                Submit & View Scorecard ✓
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    updateTimerDisplay();

    // Attach listeners
    // Option Selection
    container.querySelectorAll('.quiz-option-card[data-letter]').forEach(optCard => {
      optCard.addEventListener('click', () => {
        const letter = optCard.getAttribute('data-letter');
        userAnswers[currentIndex] = letter;
        renderQuestionInterface();
      });
    });

    // Jump to Question
    container.querySelectorAll('.quiz-qnav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeQuizState.currentIndex = parseInt(btn.getAttribute('data-index'), 10);
        renderQuestionInterface();
      });
    });

    // Flag Question
    const flagBtn = container.querySelector('#btn-flag-question');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => {
        flagged[currentIndex] = !flagged[currentIndex];
        renderQuestionInterface();
      });
    }

    // Mark as Deep Study / Weak Concept
    const deepBtn = container.querySelector('#btn-deep-understand');
    if (deepBtn) {
      deepBtn.addEventListener('click', async () => {
        deepUnderstandingMarked[currentIndex] = !deepUnderstandingMarked[currentIndex];
        if (deepUnderstandingMarked[currentIndex]) {
          await saveWeakConcept({
            concept: currentQ.concept || 'Backend Concept',
            topic: activeQuizState.topic,
            question: currentQ.question,
            explanation: currentQ.explanation,
            user_mistake: 'Flagged for deep conceptual review'
          });
          showToast('Added to your Weak Concepts Notebook. AI will train on this.');
        }
        renderQuestionInterface();
      });
    }

    // Prev / Next
    const prevBtn = container.querySelector('#btn-prev-q');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (activeQuizState.currentIndex > 0) {
          activeQuizState.currentIndex--;
          renderQuestionInterface();
        }
      });
    }

    const nextBtn = container.querySelector('#btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeQuizState.currentIndex + 1 < questions.length) {
          activeQuizState.currentIndex++;
          renderQuestionInterface();
        }
      });
    }

    // Submit Assessment
    const submitBtn = container.querySelector('#btn-submit-assessment');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const unansweredCount = questions.length - Object.keys(userAnswers).length;
        if (unansweredCount > 0) {
          if (!confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) {
            return;
          }
        }
        submitAssessment();
      });
    }

    // Export Q&A
    const exportBtn = container.querySelector('#btn-export-qa-active');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportQuestionsMarkdown(questions, activeQuizState.title);
      });
    }

    // Exit Assessment
    const exitBtn = container.querySelector('#btn-exit-assessment');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        if (confirm('Exit assessment? Your current session progress will not be saved.')) {
          if (timerInterval) clearInterval(timerInterval);
          activeQuizState = null;
          renderGeneratorView();
        }
      });
    }

    // Timer Pause / Resume
    const pauseBtn = container.querySelector('#btn-pause-timer');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        isTimerPaused = !isTimerPaused;
        pauseBtn.textContent = isTimerPaused ? '▶️' : '⏸️';
        showToast(isTimerPaused ? 'Timer paused' : 'Timer resumed');
      });
    }
  }

  // Submit & Render Scorecard View
  async function submitAssessment() {
    if (timerInterval) clearInterval(timerInterval);

    const { title, topic, difficulty, questions, userAnswers } = activeQuizState;
    let score = 0;

    questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      if (userChoice === q.correct_answer) {
        score++;
      } else {
        // Automatically record missed question into Weak Concepts notebook
        saveWeakConcept({
          concept: q.concept || topic,
          topic: topic,
          question: q.question,
          explanation: q.explanation,
          user_mistake: `Selected option (${userChoice || 'None'}), correct was (${q.correct_answer})`
        });
      }
    });

    // Mark ALL questions as RESOLVED so they are never repeated across the app!
    await markQuestionsResolved(questions);

    // Save assessment score to IndexedDB
    await saveAIQuiz({
      title,
      topic,
      difficulty,
      score,
      total: questions.length,
      date: new Date().toISOString()
    });

    const percent = Math.round((score / questions.length) * 100);

    container.innerHTML = `
      <div class="quiz-lab-layout">
        
        <!-- Scorecard Summary Card -->
        <div class="dash-overview-card" style="padding: 24px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 8px;">
            ${percent >= 80 ? '🏆' : percent >= 60 ? '⭐' : '💡'}
          </div>
          <h2 style="font-size: 1.6rem; color: var(--text-primary); margin-bottom: 4px;">
            Assessment Completed: ${escapeHtml(title)}
          </h2>
          <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-hover); margin-bottom: 12px;">
            Final Score: ${score} / ${questions.length} (${percent}%)
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 60ch; margin: 0 auto 16px auto;">
            ${percent >= 80 
              ? 'Outstanding performance! You demonstrated senior-grade comprehension of production edge cases and internal mechanics.' 
              : 'Good work. The questions you missed have been saved into your Weak Concepts profile. Future quizzes and your AI Mentor will automatically reinforce these gaps.'}
          </p>

          <div style="display: flex; justify-content: center; gap: var(--space-sm); flex-wrap: wrap;">
            <button type="button" class="btn btn-primary" id="btn-export-markdown">
              📥 Export Q&A to Markdown (.md)
            </button>
            <button type="button" class="btn btn-outline" id="btn-export-json">
              📥 Export to JSON (.json)
            </button>
            <button type="button" class="btn btn-secondary" id="btn-new-assessment">
              🔄 Create New Assessment
            </button>
          </div>
        </div>

        <!-- Detailed Question-by-Question Review -->
        <div class="quiz-main-card">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-md); color: var(--text-primary);">
            Question-by-Question Detailed Review & Explanations:
          </h3>

          <div style="display: flex; flex-direction: column; gap: var(--space-lg);">
            ${questions.map((q, idx) => {
              const userChoice = userAnswers[idx];
              const isCorrect = userChoice === q.correct_answer;

              return `
                <div style="border: 1px solid var(--border-light); border-left: 4px solid ${isCorrect ? '#22C55E' : '#EF4444'}; border-radius: var(--radius-md); padding: 18px 20px; background: #FFFFFF;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
                      Question ${idx + 1} • ${q.concept || topic}
                    </span>
                    <span class="badge ${isCorrect ? 'badge-green' : 'badge-amber'}">
                      ${isCorrect ? '✓ Correct' : `✗ Missed (You: ${userChoice || 'None'}, Answer: ${q.correct_answer})`}
                    </span>
                  </div>

                  <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">
                    ${formatMarkdown(q.question)}
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
                    ${q.options.map(opt => {
                      const optLetter = opt.trim().charAt(0);
                      const isUserChoice = userChoice === optLetter;
                      const isCorrectChoice = optLetter === q.correct_answer;
                      let bgStyle = 'background: #F8FAFC; border: 1px solid var(--border-subtle);';

                      if (isCorrectChoice) bgStyle = 'background: #F0FDF4; border: 1px solid #86EFAC; font-weight: 600; color: #166534;';
                      else if (isUserChoice) bgStyle = 'background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B;';

                      return `
                        <div style="padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.9rem; ${bgStyle}">
                          ${escapeHtml(opt)} ${isCorrectChoice ? '✓ (Correct Answer)' : isUserChoice ? '✗ (Your Pick)' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <div style="background: #FAFAF8; border-radius: var(--radius-sm); padding: 12px 16px; font-size: 0.9rem; line-height: 1.55; color: var(--text-secondary);">
                    <strong>Underlying Mechanics:</strong> ${formatMarkdown(q.explanation)}
                    ${q.edge_case_tip ? `
                      <div style="margin-top: 8px; color: #92400E; font-size: 0.85rem;">
                        ⚠️ <strong>Production Gotcha:</strong> ${escapeHtml(q.edge_case_tip)}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    // Export Handlers
    container.querySelector('#btn-export-markdown').addEventListener('click', () => {
      exportQuestionsMarkdown(questions, title);
    });

    container.querySelector('#btn-export-json').addEventListener('click', () => {
      exportQuestionsJSON(questions, title);
    });

    container.querySelector('#btn-new-assessment').addEventListener('click', () => {
      activeQuizState = null;
      renderGeneratorView();
    });
  }

  // Modals for Weak Concepts & Resolved Questions
  function showWeakConceptsModal() {
    const subviewRoot = container.querySelector('#quiz-subview-root');
    if (!subviewRoot) return;

    subviewRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card" style="max-width: 700px; width: 92%;">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.25rem;">My Weak Concepts Notebook</h3>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                Concepts you flagged or missed in past assessments. Future quizzes target these gaps.
              </div>
            </div>
            <button type="button" class="btn-close" id="btn-close-subview">✕</button>
          </div>
          <div class="modal-body">
            ${weakConcepts.length === 0 ? `
              <p style="text-align: center; color: var(--text-muted); padding: 20px;">
                No weak concepts recorded yet! As you take quizzes and flag questions, concepts will be tracked here.
              </p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 10px; max-height: 60vh; overflow-y: auto;">
                ${weakConcepts.map(w => `
                  <div style="background: #FFFDF8; border: 1px solid var(--border-light); border-left: 4px solid var(--accent-primary); border-radius: var(--radius-md); padding: 12px 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(w.concept)}</strong>
                      <button type="button" class="btn btn-outline btn-sm delete-weak-btn" data-id="${w.id}" style="font-size: 0.72rem; padding: 2px 6px;">
                        Remove
                      </button>
                    </div>
                    <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Topic: ${escapeHtml(w.topic || 'General')}</div>
                    ${w.question ? `<div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;"><em>"${escapeHtml(w.question.substring(0, 120))}..."</em></div>` : ''}
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    subviewRoot.querySelector('#btn-close-subview').addEventListener('click', () => subviewRoot.innerHTML = '');

    subviewRoot.querySelectorAll('.delete-weak-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await deleteWeakConcept(id);
        const idx = weakConcepts.findIndex(w => w.id === id);
        if (idx !== -1) weakConcepts.splice(idx, 1);
        showWeakConceptsModal();
        showToast('Concept removed from notebook.');
      });
    });
  }

  function showResolvedQuestionsModal() {
    const subviewRoot = container.querySelector('#quiz-subview-root');
    if (!subviewRoot) return;

    subviewRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card" style="max-width: 700px; width: 92%;">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.25rem;">Resolved Question Bank</h3>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                ${resolvedQuestions.length} unique questions resolved. The generator excludes these to guarantee fresh tests.
              </div>
            </div>
            <button type="button" class="btn-close" id="btn-close-subview">✕</button>
          </div>
          <div class="modal-body">
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 60vh; overflow-y: auto;">
              ${resolvedQuestions.slice(0, 50).map((r, idx) => `
                <div style="background: #FAFAF8; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.85rem;">
                  <strong>${idx + 1}.</strong> ${escapeHtml(r.question || 'Resolved Question')}
                  <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 2px;">
                    Resolved: ${new Date(r.resolved_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    subviewRoot.querySelector('#btn-close-subview').addEventListener('click', () => subviewRoot.innerHTML = '');
  }

  // Export Utilities
  function exportQuestionsMarkdown(questions, title) {
    let md = `# ${title}\n\n`;
    md += `Exported on: ${new Date().toLocaleString()}\n`;
    md += `Total Questions: ${questions.length}\n\n---\n\n`;

    questions.forEach((q, idx) => {
      md += `### Question ${idx + 1}: ${q.concept || ''}\n\n`;
      md += `${q.question}\n\n`;
      q.options.forEach(opt => {
        md += `- ${opt}\n`;
      });
      md += `\n**Correct Answer:** Option ${q.correct_answer}\n\n`;
      md += `**Explanation & Internals:**\n${q.explanation}\n\n`;
      if (q.edge_case_tip) {
        md += `> **Production Edge-Case:** ${q.edge_case_tip}\n\n`;
      }
      md += `---\n\n`;
    });

    downloadBlob(md, `${sanitizeFileName(title)}.md`, 'text/markdown');
    showToast('Exported assessment to Markdown!');
  }

  function exportQuestionsJSON(questions, title) {
    const data = {
      title,
      exported_at: new Date().toISOString(),
      total_questions: questions.length,
      questions
    };
    downloadBlob(JSON.stringify(data, null, 2), `${sanitizeFileName(title)}.json`, 'application/json');
    showToast('Exported assessment to JSON!');
  }

  function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function sanitizeFileName(name) {
    return (name || 'assessment').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  }

  // Start with Generator View
  renderGeneratorView();
}

// =========================================================================
// Offline Assessment Fallback Generator
// =========================================================================
function generateOfflineAssessment(topic, count, difficulty) {
  const allPool = [
    ...OFFLINE_MNC_QUESTION_BANKS.async_concurrency,
    ...OFFLINE_MNC_QUESTION_BANKS.sql_performance
  ];

  // Return requested number of questions
  const shuffled = [...allPool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, allPool.length));

  return {
    quiz_title: `${topic} (${difficulty.toUpperCase()}) Assessment`,
    topic,
    difficulty,
    questions: selected
  };
}

// Markdown formatting helper
function formatMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  html = html.replace(/```([a-zA-Z0-9_\-\.\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="lesson-code-box" style="margin: 8px 0;"><pre><code>${code.trim()}</code></pre></div>`;
  });
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.88em;">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\n\n/g, '<br><br>');
  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

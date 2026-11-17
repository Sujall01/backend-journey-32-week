/**
 * practice-page.js - Practice Hub
 * Includes:
 * 1. Filterable Question Bank with progressive hints & solution toggles
 * 2. Interactive Weekly Quiz Runner with immediate scoring & retakes
 * 3. Weekly Coding Challenges with GitHub submission tracking
 * 4. Aptitude & Reasoning Practice
 */

import { WEEKS } from '../data/roadmap-data.js';
import { getWeeklyQuiz } from '../data/quizzes-data.js';
import { getWeeklyChallenge } from '../data/challenges-data.js';
import {
  saveQuizAttempt,
  getQuizAttempts,
  saveChallengeSubmission,
  getChallengeSubmission,
  getAllProblemAttempts,
  saveProblemAttempt
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderPractice(container, initialTab = 'quizzes') {
  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Hands-on Engineering Practice
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">Practice & Assessment Hub</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            Solve topic-wise questions, take weekly 10-question assessments, and build real-world coding challenges.
          </p>
        </div>
        <div>
          <a href="#quiz" class="btn btn-primary" style="font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <span>🎯</span> Open AI Assessment & Quiz Lab →
          </a>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-nav">
        <button type="button" class="tab-btn ${initialTab === 'quizzes' ? 'active' : ''}" data-tab="quizzes">
          📝 Weekly Quizzes (32)
        </button>
        <button type="button" class="tab-btn ${initialTab === 'challenges' ? 'active' : ''}" data-tab="challenges">
          💻 Coding Challenges (32)
        </button>
        <button type="button" class="tab-btn ${initialTab === 'questions' ? 'active' : ''}" data-tab="questions">
          🔍 Special Question Bank
        </button>
        <button type="button" class="tab-btn ${initialTab === 'aptitude' ? 'active' : ''}" data-tab="aptitude">
          🧠 Aptitude & Reasoning
        </button>
      </div>

      <div id="practice-tab-content"></div>
    </div>
  `;

  const tabs = container.querySelectorAll('.tab-btn');
  const tabContent = container.querySelector('#practice-tab-content');

  const switchTab = async (tabName) => {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
    if (tabName === 'quizzes') await renderQuizzesTab(tabContent);
    else if (tabName === 'challenges') await renderChallengesTab(tabContent);
    else if (tabName === 'questions') await renderQuestionsTab(tabContent);
    else if (tabName === 'aptitude') renderAptitudeTab(tabContent);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
  });

  await switchTab(initialTab);
}

/* ==========================================================================
   Tab 1: Weekly Quizzes
   ========================================================================== */
async function renderQuizzesTab(container) {
  let selectedWeek = 1;

  const renderQuizSelector = async () => {
    const attempts = await getQuizAttempts(selectedWeek);
    const quiz = getWeeklyQuiz(selectedWeek);
    const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: var(--space-lg);">
        <!-- Week Selector Sidebar -->
        <div class="card card-compact" style="max-height: 75vh; overflow-y: auto;">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary);">
            Select Assessment Week
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${WEEKS.map(w => `
              <button type="button" class="week-picker-btn btn ${w.week_number === selectedWeek ? 'btn-primary' : 'btn-secondary'}" style="justify-content: flex-start; text-align: left; padding: 6px 10px; font-size: 0.85rem;" data-week="${w.week_number}">
                Week ${w.week_number}: ${escapeHtml(w.title.slice(0, 22))}...
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Quiz Details / Runner Area -->
        <div id="quiz-runner-container"></div>
      </div>
    `;

    // Listeners for week picker
    container.querySelectorAll('.week-picker-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        selectedWeek = Number(btn.getAttribute('data-week'));
        await renderQuizSelector();
      });
    });

    const runnerArea = container.querySelector('#quiz-runner-container');
    renderQuizIntroOrRunner(runnerArea, quiz, latestAttempt, attempts);
  };

  await renderQuizSelector();
}

function renderQuizIntroOrRunner(runnerArea, quiz, latestAttempt, allAttempts) {
  runnerArea.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Week ${quiz.week_number} Assessment</span>
          <h2 style="font-size: 1.4rem; margin-top: 4px;">${escapeHtml(quiz.title)}</h2>
          <div class="card-subtitle">
            10 Questions • ~20 Minutes • 4 Conceptual, 3 Code/Debug, 2 SQL/DSA, 1 Real Business Scenario
          </div>
        </div>
        ${latestAttempt ? `
          <div style="text-align: right;">
            <div style="font-size: 1.4rem; font-weight: 700; color: ${latestAttempt.score >= 7 ? 'var(--status-completed)' : 'var(--milestone-accent)'};">
              ${latestAttempt.score} / ${latestAttempt.total}
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Latest Score</div>
          </div>
        ` : ''}
      </div>

      ${latestAttempt ? `
        <div class="alert-box ${latestAttempt.score >= 7 ? 'alert-info' : 'alert-warning'}" style="margin-bottom: var(--space-md);">
          <div>
            <strong>Previous Attempt:</strong> Score: ${latestAttempt.score}/10 (${Math.round((latestAttempt.score/10)*100)}%).
            Completed on: ${new Date(latestAttempt.timestamp).toLocaleDateString()}.
            ${latestAttempt.needs_revision_topics?.length > 0 ? `<br>Recommended Revision: <em>${latestAttempt.needs_revision_topics.join(', ')}</em>` : ''}
          </div>
        </div>
      ` : ''}

      <div style="margin: var(--space-lg) 0;">
        <h4 style="font-size: 1rem; margin-bottom: 6px;">Evaluation Guidelines:</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
          <li>Immediate explanation is displayed for every question upon completion.</li>
          <li>Multiple retakes are supported; all attempts are logged in your local IndexedDB.</li>
          <li>Questions answered incorrectly will be tagged for Sunday's Weekly Review.</li>
        </ul>
      </div>

      <button type="button" class="btn btn-primary btn-lg" id="start-quiz-btn">
        ${latestAttempt ? '🔄 Retake Assessment' : '▶ Start Assessment'}
      </button>
    </div>
  `;

  runnerArea.querySelector('#start-quiz-btn').addEventListener('click', () => {
    executeQuiz(runnerArea, quiz);
  });
}

function executeQuiz(container, quiz) {
  let currentIndex = 0;
  const userAnswers = {};
  let quizStartTime = Date.now();

  const renderQuestion = () => {
    const q = quiz.questions[currentIndex];
    const isAnswered = userAnswers[currentIndex] !== undefined;

    container.innerHTML = `
      <div class="quiz-runner-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
          <span class="badge badge-slate">Question ${currentIndex + 1} of ${quiz.questions.length}</span>
          <span class="badge badge-teal">${escapeHtml(q.category)}</span>
        </div>

        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-lg); line-height: 1.5; white-space: pre-line;">
          ${escapeHtml(q.text)}
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: var(--space-lg);">
          ${q.options.map((opt, idx) => `
            <div class="quiz-option-item ${userAnswers[currentIndex] === idx ? 'selected' : ''}" data-opt-index="${idx}">
              <div style="width: 24px; height: 24px; border-radius: var(--radius-full); border: 1px solid var(--border-medium); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;">
                ${String.fromCharCode(65 + idx)}
              </div>
              <div style="font-size: 0.92rem; color: var(--text-primary);">${escapeHtml(opt)}</div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: var(--space-md);">
          <button type="button" class="btn btn-secondary btn-sm" id="prev-q-btn" ${currentIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          ${currentIndex < quiz.questions.length - 1 ? `
            <button type="button" class="btn btn-primary" id="next-q-btn">
              Next Question →
            </button>
          ` : `
            <button type="button" class="btn btn-primary btn-lg" id="submit-quiz-btn">
              ✓ Submit Assessment
            </button>
          `}
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-option-item').forEach(el => {
      el.addEventListener('click', () => {
        const selectedIdx = Number(el.getAttribute('data-opt-index'));
        userAnswers[currentIndex] = selectedIdx;
        renderQuestion();
      });
    });

    const prevBtn = container.querySelector('#prev-q-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderQuestion();
        }
      });
    }

    const nextBtn = container.querySelector('#next-q-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (userAnswers[currentIndex] === undefined) {
          showToast('Please select an option to proceed.', 'warning');
          return;
        }
        if (currentIndex < quiz.questions.length - 1) {
          currentIndex++;
          renderQuestion();
        }
      });
    }

    const submitBtn = container.querySelector('#submit-quiz-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        if (userAnswers[currentIndex] === undefined) {
          showToast('Please select an option to finish.', 'warning');
          return;
        }
        await finishQuiz(container, quiz, userAnswers, quizStartTime);
      });
    }
  };

  renderQuestion();
}

async function finishQuiz(container, quiz, userAnswers, startTime) {
  let score = 0;
  const revisionTopics = new Set();

  quiz.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correct_index) {
      score++;
    } else {
      if (q.revision_topic) revisionTopics.add(q.revision_topic);
    }
  });

  const attemptRecord = {
    week_number: quiz.week_number,
    score: score,
    total: quiz.questions.length,
    answers: userAnswers,
    needs_revision_topics: Array.from(revisionTopics),
    duration_seconds: Math.round((Date.now() - startTime) / 1000)
  };

  await saveQuizAttempt(attemptRecord);
  showToast(`Quiz completed! Score: ${score}/${quiz.questions.length}`);

  let reviewItemsHtml = quiz.questions.map((q, idx) => {
    const isCorrect = userAnswers[idx] === q.correct_index;
    return `
      <div style="padding: 14px; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 10px; background: ${isCorrect ? '#F0FDF4' : '#FEF2F2'};">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-weight: 700; font-size: 0.85rem; color: ${isCorrect ? '#166534' : '#991B1B'};">
            Question ${idx + 1}: ${isCorrect ? '✓ Correct' : '✕ Incorrect'}
          </span>
          <span class="badge badge-slate">${escapeHtml(q.category)}</span>
        </div>
        <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary); margin-bottom: 6px; white-space: pre-line;">
          ${escapeHtml(q.text)}
        </div>
        <div style="font-size: 0.85rem; margin-bottom: 4px;">
          <strong>Your Answer:</strong> ${userAnswers[idx] !== undefined ? escapeHtml(q.options[userAnswers[idx]]) : 'None'}
        </div>
        ${!isCorrect ? `
          <div style="font-size: 0.85rem; color: #166534; margin-bottom: 4px;">
            <strong>Correct Answer:</strong> ${escapeHtml(q.options[q.correct_index])}
          </div>
        ` : ''}
        <div style="font-size: 0.82rem; color: var(--text-secondary); background: #FFFFFF; padding: 8px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-primary); margin-top: 6px;">
          <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Assessment Results</span>
          <h2 style="font-size: 1.5rem; margin-top: 4px;">Week ${quiz.week_number} Quiz Completed</h2>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 2rem; font-weight: 700; color: ${score >= 7 ? 'var(--status-completed)' : 'var(--milestone-accent)'};">
            ${score} / ${quiz.questions.length}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${Math.round((score/quiz.questions.length)*100)}% Accuracy</div>
        </div>
      </div>

      ${revisionTopics.size > 0 ? `
        <div class="alert-box alert-warning">
          <div>
            <strong>Concepts to Revisit Before Moving Forward:</strong>
            <ul style="padding-left: 20px; margin-top: 4px; margin-bottom: 0;">
              ${Array.from(revisionTopics).map(t => `<li>${escapeHtml(t)}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : `
        <div class="alert-box alert-info">
          <div><strong>Outstanding Work!</strong> You achieved a perfect or near-perfect score across all concept, code, and scenario questions.</div>
        </div>
      `}

      <div style="margin: var(--space-lg) 0;">
        <h3 style="font-size: 1.15rem; margin-bottom: var(--space-sm);">Question by Question Review</h3>
        ${reviewItemsHtml}
      </div>

      <div style="display: flex; gap: var(--space-sm);">
        <button type="button" class="btn btn-secondary" onclick="window.location.reload()">
          ← Back to Quizzes
        </button>
        <a href="#roadmap/week/${quiz.week_number}" class="btn btn-primary">
          Continue Roadmap →
        </a>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Tab 2: Weekly Coding Challenges
   ========================================================================== */
async function renderChallengesTab(container) {
  let selectedWeek = 1;

  const renderChallengeView = async () => {
    const challenge = getWeeklyChallenge(selectedWeek);
    const submission = await getChallengeSubmission(selectedWeek) || {};

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: var(--space-lg);">
        <!-- Sidebar Selector -->
        <div class="card card-compact" style="max-height: 75vh; overflow-y: auto;">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary);">
            Weekly Challenges
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${WEEKS.map(w => `
              <button type="button" class="challenge-picker-btn btn ${w.week_number === selectedWeek ? 'btn-primary' : 'btn-secondary'}" style="justify-content: flex-start; text-align: left; padding: 6px 10px; font-size: 0.85rem;" data-week="${w.week_number}">
                W${w.week_number}: ${escapeHtml(w.title.slice(0, 22))}...
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Challenge Content Area -->
        <div class="card">
          <div class="card-header">
            <div>
              <span class="badge badge-amber">Week ${challenge.week_number} Coding Challenge</span>
              <h2 style="font-size: 1.4rem; margin-top: 4px;">${escapeHtml(challenge.title)}</h2>
            </div>
            ${submission.status === 'completed' ? '<span class="badge badge-green">✓ Challenge Completed</span>' : '<span class="badge badge-slate">In Progress</span>'}
          </div>

          <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: var(--space-md);">
            <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Real Business Problem:</div>
            <p style="font-size: 0.92rem; color: var(--text-primary); margin-top: 4px; line-height: 1.5;">
              ${escapeHtml(challenge.business_context)}
            </p>
          </div>

          <div style="margin-bottom: var(--space-md);">
            <h4 style="font-size: 0.95rem; margin-bottom: 6px;">Technical Requirements:</h4>
            <ul style="padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
              ${challenge.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); margin-bottom: var(--space-md); font-size: 0.85rem;">
            <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md);">
              <strong>Sample Input:</strong>
              <pre style="margin-top: 4px; padding: 6px; background: #1E293B; color: #FFF; font-size: 0.8rem;"><code>${escapeHtml(challenge.input_output.sample_input)}</code></pre>
            </div>
            <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md);">
              <strong>Expected Output:</strong>
              <pre style="margin-top: 4px; padding: 6px; background: #1E293B; color: #FFF; font-size: 0.8rem;"><code>${escapeHtml(challenge.input_output.expected_output)}</code></pre>
            </div>
          </div>

          <div style="margin-bottom: var(--space-md);">
            <h4 style="font-size: 0.95rem; color: #B45309; margin-bottom: 6px;">Edge Cases & Constraints:</h4>
            <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary);">
              ${challenge.edge_cases.map(ec => `<li>${escapeHtml(ec)}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: var(--space-lg);">
            <h4 style="font-size: 0.95rem; margin-bottom: 6px;">Evaluation Self-Checklist:</h4>
            <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary);">
              ${challenge.evaluation_checklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </div>

          <!-- Submission & Portfolio Evidence Logging Form -->
          <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: var(--space-md);">
            <h4 style="font-size: 1rem; margin-bottom: 6px;">Your Implementation Proof</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: var(--space-sm);">
              Save your local GitHub repo link, test results, or notes. We do not fake execution; write and run your code locally or on LeetCode/HackerRank.
            </div>

            <form id="challenge-submission-form">
              <div class="form-group">
                <label class="form-label" for="chal-repo-url">GitHub Repository or Commit Link (optional)</label>
                <input type="url" id="chal-repo-url" class="form-input" placeholder="https://github.com/your-username/32-week-backend/tree/main/..." value="${escapeHtml(submission.repo_url || '')}">
              </div>

              <div class="form-group">
                <label class="form-label" for="chal-notes">Implementation Notes & What You Learned</label>
                <textarea id="chal-notes" class="form-textarea" placeholder="Describe the approach taken, edge cases handled, and performance trade-offs...">${escapeHtml(submission.notes || '')}</textarea>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md);">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer;">
                  <input type="checkbox" id="chal-status-check" ${submission.status === 'completed' ? 'checked' : ''} style="width: 16px; height: 16px;">
                  Mark Challenge as Completed
                </label>
                <button type="submit" class="btn btn-primary">
                  Save Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.challenge-picker-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        selectedWeek = Number(btn.getAttribute('data-week'));
        await renderChallengeView();
      });
    });

    const form = container.querySelector('#challenge-submission-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const repoUrl = container.querySelector('#chal-repo-url').value.trim();
      const notes = container.querySelector('#chal-notes').value.trim();
      const isCompleted = container.querySelector('#chal-status-check').checked;

      await saveChallengeSubmission(selectedWeek, {
        repo_url: repoUrl,
        notes: notes,
        status: isCompleted ? 'completed' : 'in-progress'
      });

      showToast('Challenge submission saved locally!');
      await renderChallengeView();
    });
  };

  await renderChallengeView();
}

/* ==========================================================================
   Tab 3: Special Question Bank
   ========================================================================== */
async function renderQuestionsTab(container) {
  const attempts = await getAllProblemAttempts();
  const attemptMap = {};
  attempts.forEach(a => { attemptMap[a.problem_id] = a; });

  // Curated list of high-yield questions across the 10 categories
  const highYieldQuestions = [
    {
      id: "q-csharp-int-dec",
      category: "Concept Understanding",
      topic: "C# Fundamentals",
      title: "Why is decimal mandatory for monetary calculations in financial systems?",
      difficulty: "Medium",
      time: "10m",
      hint: "Binary base-2 representation vs base-10 integer scaling.",
      solution: "IEEE 754 floating point types (float and double) represent fractions in binary (base-2). Just as 1/3 cannot be represented as a finite decimal, 1/10 (0.1) cannot be represented as a finite binary fraction, resulting in accumulated rounding drift (e.g. 0.1 + 0.2 = 0.30000000000000004). The `decimal` type is a 128-bit base-10 floating point representation with 28-29 significant digits that guarantees exact representation of decimal fractions, preventing audit failures and tax discrepancy fines."
    },
    {
      id: "q-csharp-dict-hash",
      category: "Performance",
      topic: "Collections",
      title: "What causes a Dictionary<TKey, TValue> to degrade from O(1) to O(n)?",
      difficulty: "Hard",
      time: "15m",
      hint: "Hash code distribution and bucket collisions.",
      solution: "When multiple distinct keys produce the exact same hash code (or collide after modulo with the bucket array size), they are placed into the same bucket as a linked collision chain. When retrieving, the dictionary must linearly traverse this chain calling Equals() on each entry. If an attacker crafts thousands of keys that map to the exact same hash code (Hash DoS attack), lookups become O(n). .NET protects against this with randomized string hashing algorithms."
    },
    {
      id: "q-sql-nplusone",
      category: "Debugging",
      topic: "Entity Framework Core",
      title: "How do you detect and permanently fix an N+1 query bug in an ASP.NET Core API?",
      difficulty: "Hard",
      time: "15m",
      hint: "Look at SQL Server Profiler / EF Core logging and use Eager Loading (.Include) or projection.",
      solution: "An N+1 bug is detected by logging SQL queries (via Serilog, MiniProfiler, or SQL Server Profiler) and noticing that a single API request executes 1 parent query followed by hundreds of repeated queries for related children in a loop. Fix 1: Use eager loading with `.Include(e => e.Department)`. Fix 2 (Better for performance): Use LINQ projection (`.Select(e => new EmployeeDto { Name = e.Name, DeptName = e.Department.Name })`), which tells EF Core to generate a single SQL SELECT query with an INNER/LEFT JOIN and no unused columns."
    },
    {
      id: "q-sql-covering-index",
      category: "Performance",
      topic: "SQL Server",
      title: "What is a Covering Index with INCLUDE columns, and why is it superior to wide composite keys?",
      difficulty: "Hard",
      time: "15m",
      hint: "B-Tree root/intermediate nodes vs leaf level nodes.",
      solution: "A covering index contains all the columns needed to satisfy a query, eliminating the expensive Key Lookup / Bookmark Lookup against the clustered index. Adding columns in the `INCLUDE` clause stores them ONLY at the leaf level of the index B-tree rather than in the root and intermediate navigation nodes. This keeps the index small, maintains high fan-out, reduces I/O, and avoids the 16-column / 900-byte index key limit of SQL Server."
    },
    {
      id: "q-trans-isolation",
      category: "Real-world Scenario",
      topic: "Transactions & Concurrency",
      title: "How do you prevent duplicate payroll payments when two HR users click 'Run Payroll' simultaneously?",
      difficulty: "Hard",
      time: "20m",
      hint: "Unique constraints, serializable transactions, or distributed locks.",
      solution: "Layer 1: Database Unique Constraint on `PayrollRuns(Year, Month, TenantId)`. Even if two requests execute concurrently, the second insert fails with a unique constraint violation error. Layer 2: Wrap the calculation in a transaction with an Application Lock (`sp_getapplock`) or a Redis distributed lock on key `payroll:tenant_id:year_month` with an expiration TTL. Layer 3: Use an Idempotency-Key header on the POST endpoint."
    }
  ];

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <h2 style="font-size: 1.3rem;">High-Yield Special Question Bank</h2>
          <div class="card-subtitle">Edge cases, output predictions, performance gotchas, and architectural interview questions.</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-top: var(--space-md);">
        ${highYieldQuestions.map((q, idx) => {
          const attempt = attemptMap[q.id];
          return `
            <div class="question-item-card">
              <div class="question-header">
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                  <span class="badge badge-teal">${escapeHtml(q.category)}</span>
                  <span class="badge badge-slate">${escapeHtml(q.topic)}</span>
                  <span class="badge badge-amber">${q.difficulty}</span>
                </div>
                ${attempt?.status === 'solved' ? '<span class="badge badge-green">✓ Solved</span>' : ''}
              </div>

              <h3 style="font-size: 1.05rem; margin: 8px 0; color: var(--text-primary);">
                ${idx + 1}. ${escapeHtml(q.title)}
              </h3>

              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
                Clue: ${escapeHtml(q.hint)}
              </div>

              <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; this.textContent = this.nextElementSibling.style.display === 'block' ? 'Hide Solution' : 'View Progressive Solution';">
                  View Progressive Solution
                </button>
                <div style="display: none; width: 100%; margin-top: 10px; padding: 12px; background: #F8FAFC; border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm); font-size: 0.9rem; line-height: 1.6;">
                  <strong>Authoritative Explanation:</strong>
                  <p style="margin-top: 4px; color: var(--text-primary);">${escapeHtml(q.solution)}</p>
                </div>
                <button type="button" class="btn ${attempt?.status === 'solved' ? 'btn-outline' : 'btn-primary'} btn-sm solve-toggle-btn" data-qid="${q.id}">
                  ${attempt?.status === 'solved' ? '✓ Solved' : 'Mark Solved'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.solve-toggle-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const qid = btn.getAttribute('data-qid');
      await saveProblemAttempt(qid, { status: 'solved' });
      showToast('Problem marked as solved!');
      await renderQuestionsTab(container);
    });
  });
}

/* ==========================================================================
   Tab 4: Aptitude & Reasoning
   ========================================================================== */
function renderAptitudeTab(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Tuesday & Thursday Practice</span>
          <h2 style="font-size: 1.4rem; margin-top: 4px;">Quantitative Aptitude & Logical Reasoning</h2>
          <div class="card-subtitle">Essential for clearing Tier-1 MNC and established IT company initial screening rounds.</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md); margin: var(--space-md) 0;">
        <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
          <h4 style="font-size: 1.05rem; margin-bottom: 6px; color: var(--text-primary);">1. Quantitative Aptitude</h4>
          <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            <li>Percentages & Profit/Loss calculations</li>
            <li>Ratio, Proportion & Partnerships</li>
            <li>Time and Work / Pipes and Cisterns</li>
            <li>Time, Speed and Distance (Trains, Relative Speed)</li>
            <li>Permutations, Combinations & Probability</li>
          </ul>
          <div style="margin-top: 12px;">
            <a href="https://www.indiabix.com/aptitude/questions-and-answers/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              Practice Quantitative on IndiaBix ↗
            </a>
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
          <h4 style="font-size: 1.05rem; margin-bottom: 6px; color: var(--text-primary);">2. Logical & Verbal Reasoning</h4>
          <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            <li>Syllogisms & Logical Deductions</li>
            <li>Blood Relations & Family Trees</li>
            <li>Direction Sense & Coordinate reasoning</li>
            <li>Coding-Decoding & Letter Series</li>
            <li>Seating Arrangements (Linear & Circular)</li>
          </ul>
          <div style="margin-top: 12px;">
            <a href="https://www.indiabix.com/logical-reasoning/questions-and-answers/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              Practice Reasoning on IndiaBix ↗
            </a>
          </div>
        </div>
      </div>

      <div class="alert-box alert-info">
        <div>
          <strong>Study Guideline:</strong> Spend 15–20 minutes on Tuesday and Thursday solving 5–10 aptitude questions. Consistent micro-practice keeps formulas fresh without stealing time from backend coding.
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


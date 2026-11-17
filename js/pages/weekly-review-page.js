/**
 * weekly-review-page.js - Sunday Guided Weekly Review & Reflection
 * 1. 5 guided questions based on actual progress
 * 2. Real metrics comparison (Planned vs Actual hours, solved problems, quiz score)
 * 3. Data-driven honest suggestions (identifies topics tagged for revision)
 * 4. Missed-week non-punitive rescheduling guide
 */

import { WEEKS, PHASES } from '../data/roadmap-data.js';
import {
  getUserSettings,
  getAllTopicsProgress,
  getAllProblemAttempts,
  getAllQuizAttempts,
  getSpeakingLogs,
  getProjectTasks,
  saveWeeklyReview,
  getWeeklyReview
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderWeeklyReview(container) {
  const settings = await getUserSettings() || { start_date: new Date().toISOString() };
  const startDate = new Date(settings.start_date || new Date());
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
  let currentWeekNum = Math.min(32, Math.max(1, Math.floor(diffDays / 7) + 1));

  const currentWeek = WEEKS.find(w => w.week_number === currentWeekNum) || WEEKS[0];
  const topicsProgress = await getAllTopicsProgress();
  const problems = await getAllProblemAttempts();
  const quizAttempts = await getAllQuizAttempts();
  const speakingLogs = await getSpeakingLogs();
  const projectTasks = await getProjectTasks();
  const existingReview = await getWeeklyReview(currentWeekNum) || {};

  // Actual metrics for current week
  const weekTopics = currentWeek.topics;
  const completedWeekTopics = weekTopics.filter(t => topicsProgress[t.id]?.status === 'completed');
  const revisionWeekTopics = weekTopics.filter(t => topicsProgress[t.id]?.status === 'needs-revision');
  const weekQuizAttempt = quizAttempts.filter(q => q.week_number === currentWeekNum).pop();
  const solvedCount = problems.filter(p => p.status === 'solved').length;

  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Sunday Guided Reflection
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">Week ${currentWeek.week_number} Review & Performance Analysis</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            Reflect on what you built, evaluate actual study hours honestly, and reset calmly for next week.
          </p>
        </div>
      </div>

      <!-- Real Data Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-sm); margin-bottom: var(--space-lg);">
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--accent-hover);">
            ${completedWeekTopics.length} / ${weekTopics.length}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Week Topics Completed</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: #0284C7;">
            ${solvedCount}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Problems Solved (Overall)</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: ${weekQuizAttempt ? 'var(--status-completed)' : 'var(--text-muted)'};">
            ${weekQuizAttempt ? `${weekQuizAttempt.score} / ${weekQuizAttempt.total}` : 'Not Taken'}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Weekly Assessment Score</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.4rem; font-weight: 700; color: var(--milestone-accent);">
            ${speakingLogs.length}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Speaking Sessions Logged</div>
        </div>
      </div>

      <!-- Honest Data-Driven Suggestions Box -->
      <div class="card" style="margin-bottom: var(--space-lg); background: #F8FAFC; border-left: 4px solid var(--accent-primary);">
        <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 4px;">
          📊 Automated Analysis of Your Logged Data
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
          ${revisionWeekTopics.length > 0
            ? `You have marked <strong>${revisionWeekTopics.length} topic(s)</strong> (${revisionWeekTopics.map(t => t.title).join(', ')}) as needing revision. Allocate 30 minutes on Monday or Wednesday to review their guided examples before progressing.`
            : `Your topic progression in Week ${currentWeek.week_number} is clean with no outstanding flagged revision items. Ensure you complete the weekly quiz before closing out Sunday.`
          }
        </p>
      </div>

      <!-- 5 Reflection Questions Form -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <h3 class="card-title">Sunday Reflection (5 Guided Questions)</h3>
          <div class="card-subtitle">Keep it brief and honest. No fluff or self-judgement.</div>
        </div>

        <form id="weekly-review-form">
          <div class="form-group">
            <label class="form-label" for="rev-q1">1. What did I complete this week?</label>
            <textarea id="rev-q1" class="form-textarea" placeholder="e.g. Completed all C# loop exercises, solved 3 SQL JOIN problems, implemented Wednesday 4-hour focus...">${escapeHtml(existingReview.completed_summary || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="rev-q2">2. What was difficult or confusing?</label>
            <textarea id="rev-q2" class="form-textarea" placeholder="e.g. Understanding string immutability memory allocations or solving the edge case for mid-month joining...">${escapeHtml(existingReview.difficulties || '')}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="rev-q3">3. Which specific concept needs revision?</label>
            <input type="text" id="rev-q3" class="form-input" placeholder="e.g. Decimal MidpointRounding or SQL HAVING vs WHERE" value="${escapeHtml(existingReview.revision_concept || '')}">
          </div>

          <div class="form-group">
            <label class="form-label" for="rev-hours">4. Did I meet my 12-hour weekly target? (Estimated actual hours)</label>
            <div style="display: flex; gap: var(--space-sm); align-items: center;">
              <input type="number" id="rev-hours" class="form-input" style="width: 120px;" min="0" max="40" step="0.5" value="${existingReview.actual_hours || 12}">
              <span style="font-size: 0.9rem; color: var(--text-secondary);">Target: 12.0 hours</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="rev-q5">5. What single improvement will I prioritize next week?</label>
            <textarea id="rev-q5" class="form-textarea" placeholder="e.g. Speak more slowly during the 3-minute technical explanation and complete the weekly quiz on Saturday instead of late Sunday...">${escapeHtml(existingReview.next_week_plan || '')}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: var(--space-md);">
            <button type="submit" class="btn btn-primary btn-lg">
              ✓ Save Sunday Review
            </button>
          </div>
        </form>
      </div>

      <!-- Non-Punitive Missed-Week Catch-Up Planner -->
      <div class="card" style="background: #FFFDF8; border: 1px solid var(--milestone-border);">
        <div class="card-header">
          <div>
            <span class="badge badge-amber">Non-Punitive Catch-Up Guide</span>
            <h3 style="font-size: 1.15rem; margin-top: 4px; color: var(--text-primary);">Did you miss study sessions this week?</h3>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-sm);">
          Real life happens: work deadlines, family commitments, or fatigue. Our platform operates on <strong>resilience, not guilt</strong>:
        </p>
        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-md);">
          <li><strong>Never double your hours:</strong> Trying to study 24 hours next week leads to burnout. Keep your 12-hour weekly boundary.</li>
          <li><strong>Prioritize core over advanced:</strong> If behind on a week, complete the core 7-step lessons and defer optional advanced challenges.</li>
          <li><strong>Adjust your start date:</strong> In Settings, you can easily shift your roadmap start date by 7 days without losing any completed tasks.</li>
        </ul>
        <div style="display: flex; gap: var(--space-sm);">
          <a href="#settings" class="btn btn-secondary btn-sm">
            Adjust Schedule in Settings →
          </a>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#weekly-review-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewData = {
      completed_summary: container.querySelector('#rev-q1').value.trim(),
      difficulties: container.querySelector('#rev-q2').value.trim(),
      revision_concept: container.querySelector('#rev-q3').value.trim(),
      actual_hours: Number(container.querySelector('#rev-hours').value) || 12,
      next_week_plan: container.querySelector('#rev-q5').value.trim()
    };

    await saveWeeklyReview(currentWeekNum, reviewData);
    showToast('Weekly review recorded! Ready for the week ahead.');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


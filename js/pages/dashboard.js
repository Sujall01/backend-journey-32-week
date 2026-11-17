/**
 * dashboard.js - Redesigned Clean Command Center
 * High-signal, calm, uncluttered dashboard using full workspace width.
 * Answers the essential learning questions at a glance:
 * 1. Where am I right now? (Phase, Week of 32, Progress)
 * 2. What is my next immediate action? (Continue where I left off hero)
 * 3. Meaningful progress metrics (Hours, Topics, Problems, SQL, Milestones)
 * 4. Contextual learning insight derived from real data
 * 5. Upcoming portfolio milestone & Wednesday 4-hour focus reminder
 */

import { WEEKS, PHASES, getRoadmapStats } from '../data/roadmap-data.js';
import {
  getUserSettings,
  getAllTopicsProgress,
  getAllProblemAttempts,
  getProjectTasks,
  getSpeakingLogs,
  getLastActiveTopic,
  saveTopicProgress
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderDashboard(container) {
  const settings = await getUserSettings() || {
    display_name: 'Engineer',
    start_date: new Date().toISOString().split('T')[0],
    weekly_target_hours: 12
  };

  const topicsProgress = await getAllTopicsProgress();
  const problemAttempts = await getAllProblemAttempts();
  const projectTasks = await getProjectTasks();
  const speakingLogs = await getSpeakingLogs();
  const lastActive = await getLastActiveTopic();

  // Calculate current week from start date
  const startDate = new Date(settings.start_date || new Date());
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
  const currentWeekNum = Math.min(32, Math.max(1, Math.floor(diffDays / 7) + 1));

  const currentWeek = WEEKS.find(w => w.week_number === currentWeekNum) || WEEKS[0];
  const currentPhase = PHASES.find(p => p.id === currentWeek.phase_id) || PHASES[0];

  // Total topics count across entire 32 weeks
  let totalTopicsCount = 0;
  WEEKS.forEach(w => {
    if (w.topics) totalTopicsCount += w.topics.length;
  });

  // Calculate completed topics and revision items
  let completedTopicsCount = 0;
  let revisionNeededTopics = [];
  for (const tid in topicsProgress) {
    const p = topicsProgress[tid];
    if (p.status === 'completed' || p.status === 'mastered') {
      completedTopicsCount++;
    } else if (p.status === 'needs-revision') {
      revisionNeededTopics.push(tid);
    }
  }

  const overallPercent = totalTopicsCount > 0 
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100) 
    : 0;

  // Identify next actionable topic (Continue where left off)
  let continueTopic = null;
  let continueWeekNum = currentWeekNum;

  if (lastActive && lastActive.topic_id) {
    // Try to find the last active topic in WEEKS
    for (const w of WEEKS) {
      const match = (w.topics || []).find(t => t.id === lastActive.topic_id);
      if (match) {
        continueTopic = match;
        continueWeekNum = w.week_number;
        break;
      }
    }
  }

  // Fallback to first incomplete topic in current week
  if (!continueTopic) {
    for (const t of (currentWeek.topics || [])) {
      const p = topicsProgress[t.id];
      if (!p || (p.status !== 'completed' && p.status !== 'mastered')) {
        continueTopic = t;
        break;
      }
    }
  }

  // Fallback to first incomplete topic in any week
  if (!continueTopic) {
    for (const w of WEEKS) {
      for (const t of (w.topics || [])) {
        const p = topicsProgress[t.id];
        if (!p || (p.status !== 'completed' && p.status !== 'mastered')) {
          continueTopic = t;
          continueWeekNum = w.week_number;
          break;
        }
      }
      if (continueTopic) break;
    }
  }

  // Ultimate fallback
  if (!continueTopic && currentWeek.topics && currentWeek.topics.length > 0) {
    continueTopic = currentWeek.topics[0];
  }

  // Upcoming milestone calculation
  let nextMilestone = null;
  for (const w of WEEKS) {
    if (w.milestone && w.week_number >= currentWeekNum) {
      nextMilestone = { week: w.week_number, name: w.milestone };
      break;
    }
  }
  if (!nextMilestone) {
    nextMilestone = { week: 32, name: "Production Portfolio & MNC Readiness" };
  }

  // Solved problems count
  const solvedProblemsCount = problemAttempts.filter(p => p.status === 'solved' || p.status === 'mastered').length;
  const attemptedProblemsCount = problemAttempts.length;

  // Solved SQL queries estimate
  const solvedSqlCount = problemAttempts.filter(p => 
    (p.category === 'sql' || (p.problem_id && p.problem_id.startsWith('sql_'))) && 
    (p.status === 'solved' || p.status === 'mastered')
  ).length;

  // Estimated total hours (topics: ~1.5h, problems: ~0.3h, speaking: ~0.25h)
  const estimatedHours = Math.round((completedTopicsCount * 1.5) + (solvedProblemsCount * 0.4) + (speakingLogs.length * 0.25));

  // Milestones count
  const completedMilestones = (typeof projectTasks === 'object' && projectTasks !== null)
    ? Object.values(projectTasks).filter(Boolean).length
    : 0;

  // Day of week & Wednesday calculations
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const isWednesday = dayOfWeek === 'Wednesday';
  const currentDayIndex = today.getDay(); // 0 is Sunday, 3 is Wednesday
  const daysUntilWed = (3 - currentDayIndex + 7) % 7 || 7;

  // Generate smart insight based on real activity
  let smartInsight = {
    icon: '💡',
    title: 'Focused Cadence',
    message: `You are in Week ${currentWeek.week_number} (${currentPhase.title.split(':')[0]}). Keep your daily sessions calm, clear, and consistent.`
  };

  if (revisionNeededTopics.length > 0) {
    smartInsight = {
      icon: '🔄',
      title: 'Revision Recommended',
      message: `You have ${revisionNeededTopics.length} topic${revisionNeededTopics.length > 1 ? 's' : ''} marked for revision. A quick 15-minute review will solidify your grasp before proceeding.`
    };
  } else if (isWednesday) {
    smartInsight = {
      icon: '⚡',
      title: 'Wednesday Deep Learning Day',
      message: 'Today is your dedicated 4-hour non-work study block. Dive into practical implementation, SQL indexing, and technical explanation.'
    };
  } else if (solvedProblemsCount < 5 && currentWeekNum > 1) {
    smartInsight = {
      icon: '🎯',
      title: 'Practice Question Bank',
      message: 'Solidify theoretical concepts by solving 2-3 targeted backend questions in the Practice section this week.'
    };
  } else if (speakingLogs.length === 0) {
    smartInsight = {
      icon: '🎙️',
      title: 'Communication Practice',
      message: 'Practice explaining 1 backend concept aloud today using the 5-step framework: Concept, Purpose, Mechanics, ERP Example, Edge Cases.'
    };
  }

  container.innerHTML = `
    <div class="dash-container">
      
      <!-- 1. Compact Learning Overview Header -->
      <section class="dash-overview-card" aria-label="Learning Overview">
        <div class="dash-overview-top">
          <div class="dash-brand-phase">
            <span class="dash-phase-pill">Phase ${currentPhase.id}: ${escapeHtml(currentPhase.title.split(':')[0])}</span>
            <span class="badge badge-slate">Week ${currentWeek.week_number} of 32</span>
          </div>
          <div class="dash-progress-meta">
            <span><strong>${completedTopicsCount}</strong> of ${totalTopicsCount} Topics (${overallPercent}%)</span>
            <span>Target: <strong>12 hrs/wk</strong> (4h Wednesday Focus)</span>
          </div>
        </div>

        <div>
          <div class="dash-progress-bar-bg" style="height: 6px; background: var(--bg-surface-alt); border-radius: 999px; overflow: hidden;">
            <div class="dash-progress-bar-fill" style="width: ${overallPercent}%; height: 100%; background: var(--accent-primary); border-radius: 999px; transition: width 0.4s ease;"></div>
          </div>
        </div>
      </section>

      <!-- 2. Prominent Actionable Hero: Continue Where I Left Off -->
      <section class="dash-continue-hero" aria-label="Next Action">
        <div class="dash-continue-info">
          <div class="dash-continue-tag">
            ▶ Continue Where You Left Off
          </div>
          <h2 class="dash-continue-title">
            ${continueTopic ? escapeHtml(continueTopic.title) : 'Start Week ' + currentWeek.week_number}
          </h2>
          <div class="dash-continue-desc">
            ${continueTopic && continueTopic.time ? `Estimated time: ${continueTopic.time} • ` : ''}
            Phase ${currentPhase.id} • Week ${continueWeekNum} • Clean explanation, line-by-line code, video & edge cases.
          </div>
        </div>

        <div class="dash-continue-actions">
          ${continueTopic ? `
            <a href="#topic/${continueTopic.id}" class="btn btn-primary" style="padding: 10px 22px; font-weight: 600;">
              Continue Lesson →
            </a>
            <button type="button" class="btn btn-secondary btn-sm" id="dash-quick-complete" data-id="${continueTopic.id}" title="Mark completed">
              ✓ Mark Done
            </button>
          ` : `
            <a href="#roadmap/week/${currentWeek.week_number}" class="btn btn-primary">
              View Week ${currentWeek.week_number} Syllabus →
            </a>
          `}
          <a href="#mentor" class="btn btn-outline btn-sm" title="Ask AI Mentor for guidance">
            ✨ Ask Mentor
          </a>
        </div>
      </section>

      <!-- 3. Meaningful Progress Row (Compact, Unobtrusive) -->
      <section class="dash-metrics-strip" aria-label="Progress Metrics">
        <div class="dash-metric-item">
          <div class="dash-metric-num">~${estimatedHours}h</div>
          <div class="dash-metric-label">Estimated Study Logged</div>
        </div>
        <div class="dash-metric-item">
          <div class="dash-metric-num">${completedTopicsCount} <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted);">/ ${totalTopicsCount}</span></div>
          <div class="dash-metric-label">Roadmap Topics Mastered</div>
        </div>
        <div class="dash-metric-item">
          <div class="dash-metric-num">${solvedProblemsCount} <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted);">(${attemptedProblemsCount} tried)</span></div>
          <div class="dash-metric-label">Practice Questions Solved</div>
        </div>
        <div class="dash-metric-item">
          <div class="dash-metric-num">${solvedSqlCount}</div>
          <div class="dash-metric-label">SQL Queries Practised</div>
        </div>
        <div class="dash-metric-item">
          <div class="dash-metric-num">${completedMilestones} <span style="font-size: 0.85rem; font-weight: normal; color: var(--text-muted);">/ 6</span></div>
          <div class="dash-metric-label">Portfolio Milestones Done</div>
        </div>
      </section>

      <!-- 4. Balanced Two-Column Row: Learning Insight & Next Milestone -->
      <div class="dash-split-row">
        <!-- Smart Insight Derived from Data -->
        <div class="dash-insight-card">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 1.15rem;">${smartInsight.icon}</span>
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0;">
              ${smartInsight.title}
            </h3>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 12px 0;">
            ${smartInsight.message}
          </p>
          <div style="display: flex; gap: var(--space-xs);">
            ${revisionNeededTopics.length > 0 ? `
              <a href="#roadmap" class="btn btn-outline btn-sm" style="font-size: 0.78rem;">
                Review ${revisionNeededTopics.length} Flagged Topics →
              </a>
            ` : `
              <a href="#practice" class="btn btn-outline btn-sm" style="font-size: 0.78rem;">
                Explore Question Bank →
              </a>
            `}
            <a href="#mentor" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">
              Discuss with Mentor
            </a>
          </div>
        </div>

        <!-- Upcoming Milestone Card -->
        <div class="dash-milestone-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <span class="badge badge-amber" style="font-size: 0.72rem;">Target: Week ${nextMilestone.week}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Milestone</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px 0;">
            ${escapeHtml(nextMilestone.name)}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin: 0 0 12px 0;">
            Synthesize your C#, database design, and architecture into verifiable GitHub portfolio proof.
          </p>
          <a href="#projects" class="btn btn-outline btn-sm" style="font-size: 0.78rem;">
            Inspect Project Specification →
          </a>
        </div>
      </div>

      <!-- 5. Contextual Wednesday 4-Hour Reminder Notice -->
      <section class="dash-wednesday-notice" aria-label="Wednesday Schedule">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.25rem;">${isWednesday ? '⚡' : '📅'}</span>
          <div>
            <strong>${isWednesday ? 'Today is Wednesday — 4-Hour Deep Focus Day!' : `Wednesday Study Focus (Next in ${daysUntilWed} day${daysUntilWed > 1 ? 's' : ''})`}</strong>
            <span style="color: var(--text-secondary); margin-left: 6px;">
              75m Concept • 10m Break • 75m Code • 10m Break • 45m SQL • 25m Speaking
            </span>
          </div>
        </div>
        <div style="display: flex; gap: var(--space-xs);">
          <a href="#mentor" class="btn btn-secondary btn-sm" style="padding: 4px 12px; font-size: 0.8rem;">
            ${isWednesday ? 'Plan Today’s Session 🪄' : 'Session Breakdown'}
          </a>
        </div>
      </section>

    </div>
  `;

  // Attach quick-complete handler
  const quickBtn = container.querySelector('#dash-quick-complete');
  if (quickBtn) {
    quickBtn.addEventListener('click', async () => {
      const topicId = quickBtn.getAttribute('data-id');
      await saveTopicProgress(topicId, { status: 'completed' });
      showToast('Topic marked completed! Consistent progress.');
      renderDashboard(container);
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

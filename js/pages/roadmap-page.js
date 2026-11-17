/**
 * roadmap-page.js - Complete 32-Week Interactive Roadmap Explorer
 * Collapsible phases, week drill-downs, dynamic summary calculation,
 * and seamless navigation into topic lessons.
 */

import { PHASES, WEEKS, getRoadmapStats } from '../data/roadmap-data.js';
import { getAllTopicsProgress } from '../storage.js';

export async function renderRoadmap(container, specificWeekNumber = null) {
  const topicsProgress = await getAllTopicsProgress();
  const stats = getRoadmapStats();

  if (specificWeekNumber) {
    renderWeekDetailView(container, Number(specificWeekNumber), topicsProgress);
    return;
  }

  // Count overall completed topics
  let completedTopicsCount = 0;
  for (const tid in topicsProgress) {
    if (topicsProgress[tid].status === 'completed') completedTopicsCount++;
  }
  const overallPercentage = Math.round((completedTopicsCount / stats.totalTopics) * 100) || 0;

  let phasesHtml = '';

  for (const phase of PHASES) {
    const phaseWeeks = WEEKS.filter(w => w.phase_id === phase.id);
    let phaseTotalTopics = 0;
    let phaseCompletedTopics = 0;

    for (const w of phaseWeeks) {
      phaseTotalTopics += w.topics.length;
      phaseCompletedTopics += w.topics.filter(t => topicsProgress[t.id]?.status === 'completed').length;
    }
    const phasePercentage = phaseTotalTopics > 0 ? Math.round((phaseCompletedTopics / phaseTotalTopics) * 100) : 0;

    let weeksHtml = '';
    for (const w of phaseWeeks) {
      const wCompleted = w.topics.filter(t => topicsProgress[t.id]?.status === 'completed').length;
      const isMilestone = Boolean(w.milestone);

      weeksHtml += `
        <div class="week-tile ${isMilestone ? 'milestone-week' : ''}" onclick="window.location.hash='#roadmap/week/${w.week_number}'">
          <div class="week-tile-header">
            <span>Week ${w.week_number}</span>
            <span>${wCompleted} / ${w.topics.length} Done</span>
          </div>
          <div class="week-tile-title">${escapeHtml(w.title)}</div>
          <div class="progress-bar-bg" style="height: 4px; margin: 4px 0;">
            <div class="progress-bar-fill ${isMilestone ? 'amber' : ''}" style="width: ${(wCompleted / w.topics.length) * 100}%;"></div>
          </div>
          <div class="week-tile-meta">
            <span class="badge badge-slate">${w.targets.csharp} C#</span>
            <span class="badge badge-slate">${w.targets.sql} SQL</span>
            <span class="badge badge-slate">${w.targets.dsa} DSA</span>
            ${isMilestone ? '<span class="badge badge-amber">★ Milestone</span>' : ''}
          </div>
        </div>
      `;
    }

    phasesHtml += `
      <div class="phase-card">
        <div class="phase-header-interactive" onclick="this.parentElement.classList.toggle('collapsed')">
          <div class="phase-title-group">
            <span class="phase-number">Phase ${phase.id}</span>
            <div>
              <h3 style="font-size: 1.15rem; color: var(--text-primary);">${escapeHtml(phase.title)}</h3>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                Weeks ${phase.weeks[0]}–${phase.weeks[phase.weeks.length - 1]} • ${phaseCompletedTopics} / ${phaseTotalTopics} Topics Complete (${phasePercentage}%)
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${phase.milestone ? `<span class="badge badge-amber" style="display: none; @media(min-width: 600px){display: inline-flex;}">★ ${escapeHtml(phase.milestone.split(':')[0])}</span>` : ''}
            <span class="accordion-chevron">▼</span>
          </div>
        </div>
        <div class="phase-weeks-grid">
          ${weeksHtml}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Structured Curriculum
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">32-Week Backend Engineering Roadmap</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 700px;">
            Complete, balanced path from C# and Web Forms foundations to ASP.NET Core, SQL Server, Clean Architecture, Docker, Multi-Tenancy, and MNC Interview Readiness.
          </p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-hover);">${overallPercentage}%</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${completedTopicsCount} of ${stats.totalTopics} Topics Finished</div>
        </div>
      </div>

      <!-- Computed Summary Statistics (Verified against seeded data) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-sm); margin-bottom: var(--space-lg);">
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">${stats.totalWeeks}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Weeks Total</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-hover);">${stats.totalCsharp}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">C# Exercises</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: #0284C7);">${stats.totalSql}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">SQL Queries</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: #D97706);">${stats.totalDsa}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">DSA Problems</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--milestone-accent);">${stats.totalMilestones}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Major Milestones</div>
        </div>
        <div class="card card-compact" style="text-align: center;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-secondary);">${stats.totalRoadmapHours}h</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Total Planned Hours</div>
        </div>
      </div>
    </div>

    <!-- 8 Collapsible Phases -->
    <div>
      ${phasesHtml}
    </div>
  `;
}

function renderWeekDetailView(container, weekNum, topicsProgress) {
  const week = WEEKS.find(w => w.week_number === weekNum) || WEEKS[0];
  const phase = PHASES.find(p => p.id === week.phase_id) || PHASES[0];

  let topicsListHtml = '';
  for (const topic of week.topics) {
    const prog = topicsProgress[topic.id] || { status: 'not-started' };
    let statusBadge = '<span class="badge badge-status-not-started">Not Started</span>';
    if (prog.status === 'learning') statusBadge = '<span class="badge badge-status-learning">Learning</span>';
    if (prog.status === 'practising') statusBadge = '<span class="badge badge-status-practising">Practising</span>';
    if (prog.status === 'needs-revision') statusBadge = '<span class="badge badge-status-revision">Needs Revision</span>';
    if (prog.status === 'completed') statusBadge = '<span class="badge badge-status-completed">✓ Completed</span>';

    topicsListHtml += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 8px; background: #FFFFFF; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">
              <a href="#topic/${topic.id}">${escapeHtml(topic.title)}</a>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
              Estimated: ${topic.time} • Difficulty: ${topic.diff}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${statusBadge}
          <a href="#topic/${topic.id}" class="btn btn-secondary btn-sm">
            Open 7-Step Lesson →
          </a>
        </div>
      </div>
    `;
  }

  let specialQsHtml = '';
  if (week.special_questions && week.special_questions.length > 0) {
    specialQsHtml = `
      <div class="card" style="margin-top: var(--space-lg); background: #FFFDF8; border-left: 4px solid var(--milestone-accent);">
        <h4 style="font-size: 1.05rem; margin-bottom: var(--space-xs); color: var(--text-primary);">
          🎯 Special Topic Questions & Edge Cases
        </h4>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
          High-yield interview questions and boundary-condition challenges for this week:
        </div>
        <ul style="padding-left: 20px; line-height: 1.6; font-size: 0.9rem;">
          ${week.special_questions.map(q => `<li style="margin-bottom: 6px;">${escapeHtml(q)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  container.innerHTML = `
    <div>
      <div style="margin-bottom: var(--space-md);">
        <a href="#roadmap" class="btn btn-secondary btn-sm">
          ← Back to All 32 Weeks
        </a>
      </div>

      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <div>
            <span class="badge badge-teal">Phase ${phase.id}: ${escapeHtml(phase.title.split(':')[1] || phase.title)}</span>
            <h1 style="font-size: 1.5rem; margin-top: 6px;">Week ${week.week_number}: ${escapeHtml(week.title)}</h1>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
              ${escapeHtml(week.description)}
            </p>
          </div>
          ${week.milestone ? `<span class="badge badge-amber" style="font-size: 0.85rem; padding: 6px 12px;">★ ${escapeHtml(week.milestone)}</span>` : ''}
        </div>

        <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-top: var(--space-md);">
          <span class="badge badge-slate">${week.targets.csharp} C# Exercises</span>
          <span class="badge badge-slate">${week.targets.sql} SQL Queries</span>
          <span class="badge badge-slate">${week.targets.dsa} DSA Problems</span>
          <a href="#practice" class="btn btn-outline btn-sm" style="margin-left: auto;">
            Take Week ${week.week_number} Quiz →
          </a>
        </div>
      </div>

      <div>
        <h3 style="font-size: 1.15rem; margin-bottom: var(--space-sm);">Curriculum Topics (${week.topics.length})</h3>
        ${topicsListHtml}
      </div>

      ${specialQsHtml}
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


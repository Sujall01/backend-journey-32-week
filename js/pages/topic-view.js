/**
 * topic-view.js - Full 7-Step Structured Lesson Experience with Continuous Video Learning
 * Implements:
 * 1. Orientation & Enterprise Context
 * 2. Core Concept
 * 2.5. Curated YouTube Video Learning (English & Hindi) with local watch status & notes
 * 3. Guided line-by-line example
 * 4. Practical implementation task with progressive hints
 * 5. Question bank (Concept, Code, Debugging, Edge Cases, Interview)
 * 6. Explain it yourself framework
 * 7. Evidence-based mastery status tracking (Read/Watched, Practising, Solved, Mastered)
 */

import { getTopicLesson } from '../data/topics-data.js';
import { WEEKS } from '../data/roadmap-data.js';
import {
  getTopicProgress,
  saveTopicProgress,
  getVideoProgress,
  saveVideoProgress,
  setLastActiveTopic
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderTopicView(container, topicId) {
  // Find topic and parent week
  let parentWeek = null;
  let topicInfo = null;

  for (const w of WEEKS) {
    const t = w.topics.find(top => top.id === topicId);
    if (t) {
      parentWeek = w;
      topicInfo = t;
      break;
    }
  }

  const lesson = getTopicLesson(topicId, parentWeek?.week_number || 1, topicInfo?.title || topicId);
  const progress = await getTopicProgress(topicId) || {
    status: 'learning',
    notes: '',
    explanation_notes: ''
  };

  const videoRecord = await getVideoProgress(topicId) || {
    watched: false,
    language: 'en',
    notes: ''
  };

  // Record this as the active topic for "Continue where I left off"
  await setLastActiveTopic(topicId, lesson.week_number, lesson.title);

  let currentLang = videoRecord.language || 'en';
  const fallbackVideo = {
    title: `${lesson.title} - Video Tutorial`,
    channel: '.NET & Backend Engineering',
    duration: '25m',
    embedUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLdo4fOcmZ0oVxKLQCHpiUWunhvvXx1730',
    watchUrl: 'https://www.youtube.com'
  };

  let activeVideo = (currentLang === 'hi' && lesson.video?.hindi)
    ? lesson.video.hindi
    : (lesson.video?.primary || lesson.video?.hindi || fallbackVideo);

  container.innerHTML = `
    <div style="margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <a href="#roadmap/week/${lesson.week_number}" class="btn btn-secondary btn-sm">
        ← Back to Week ${lesson.week_number}
      </a>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Mastery Status:</span>
        <select id="topic-status-select" class="form-select" style="width: auto; padding: 4px 10px; font-weight: 600;">
          <option value="not-started" ${progress.status === 'not-started' ? 'selected' : ''}>Not Started</option>
          <option value="read-watched" ${progress.status === 'read-watched' ? 'selected' : ''}>Read Concept / Watched Video</option>
          <option value="practising" ${progress.status === 'practising' ? 'selected' : ''}>Practising Code & Tasks</option>
          <option value="solved-with-hints" ${progress.status === 'solved-with-hints' ? 'selected' : ''}>Solved with Hints</option>
          <option value="solved-independently" ${progress.status === 'solved-independently' ? 'selected' : ''}>Solved Independently</option>
          <option value="needs-revision" ${progress.status === 'needs-revision' ? 'selected' : ''}>Needs Revision</option>
          <option value="completed" ${progress.status === 'completed' ? 'selected' : ''}>✓ Completed</option>
          <option value="mastered" ${progress.status === 'mastered' ? 'selected' : ''}>★ Confidently Mastered</option>
        </select>
      </div>
    </div>

    <div class="lesson-layout">
      <!-- Step 1: What am I learning? -->
      <div class="lesson-step-card" id="step-1">
        <div class="step-indicator">Step 1 • Orientation & Relevance</div>
        <h2 style="font-size: 1.55rem; color: var(--text-primary); margin-bottom: 6px;">
          ${escapeHtml(lesson.title)}
        </h2>

        <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-bottom: var(--space-md);">
          <span class="badge badge-teal">Estimated: ${lesson.time}</span>
          <span class="badge badge-slate">Difficulty: ${lesson.difficulty}</span>
          <span class="badge badge-slate">Week ${lesson.week_number}</span>
          <span class="badge badge-amber">Prerequisites: ${escapeHtml(lesson.prerequisites)}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md); margin-top: var(--space-sm);">
          <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-md);">
            <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase;">Why This Topic Matters</div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5;">
              ${escapeHtml(lesson.why_it_matters)}
            </p>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-md);">
            <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase;">Enterprise Real-World Usage</div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5;">
              ${escapeHtml(lesson.real_world_usage)}
            </p>
          </div>
        </div>
      </div>

      <!-- Step 2: Understand the Concept -->
      <div class="lesson-step-card" id="step-2">
        <div class="step-indicator">Step 2 • Core Architectural Concept</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-sm);">Understand the Concept</h3>

        <div style="margin-bottom: var(--space-md); font-size: 0.92rem; line-height: 1.6;">
          <p style="margin-bottom: 8px;"><strong>Definition:</strong> ${escapeHtml(lesson.concept.definition)}</p>
          <p style="margin-bottom: 8px;"><strong>Why It Exists:</strong> ${escapeHtml(lesson.concept.why_it_exists)}</p>
          <p><strong>How It Works:</strong> ${escapeHtml(lesson.concept.how_it_works)}</p>
        </div>

        <div class="lesson-code-box">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase;">
            Clean C# Code Example
          </div>
          <pre><code>${escapeHtml(lesson.concept.code_snippet)}</code></pre>
        </div>

        <div class="erp-context-callout">
          <div style="font-weight: 700; color: #0369A1; margin-bottom: 2px;">
            🏢 Real-World ERP / Business Context:
          </div>
          <div>${escapeHtml(lesson.concept.erp_example)}</div>
        </div>

        <div class="mistakes-callout">
          <div style="font-weight: 700; color: #B45309; margin-bottom: 2px;">
            ⚠️ Common Mistakes & Pitfalls:
          </div>
          <div>${escapeHtml(lesson.concept.common_mistakes)}</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-sm); margin-top: var(--space-md); font-size: 0.85rem;">
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 10px 14px; border-radius: var(--radius-md);">
            <strong style="color: #15803D;">✓ When to Use:</strong>
            <div style="color: #166534; margin-top: 2px;">${escapeHtml(lesson.concept.when_to_use)}</div>
          </div>
          <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 10px 14px; border-radius: var(--radius-md);">
            <strong style="color: #B91C1C;">✕ When NOT to Use:</strong>
            <div style="color: #991B1B; margin-top: 2px;">${escapeHtml(lesson.concept.when_not_to_use)}</div>
          </div>
        </div>

        <!-- Continuous Video Learning Section -->
        <div class="lesson-video-box" id="lesson-video-section">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <div>
              <span class="step-indicator" style="color: #DC2626;">🎥 Continuous Video Learning</span>
              <h4 style="font-size: 1.05rem; margin-top: 2px;" id="video-display-title">
                ${escapeHtml(activeVideo.title)}
              </h4>
            </div>

            <!-- Language Switcher: English vs Hindi -->
            <div class="video-lang-switch">
              <button type="button" class="video-lang-btn ${currentLang === 'en' ? 'active' : ''}" id="lang-en-btn">
                English
              </button>
              <button type="button" class="video-lang-btn ${currentLang === 'hi' ? 'active' : ''}" id="lang-hi-btn">
                Hindi (हिंदी)
              </button>
            </div>
          </div>

          <!-- 16:9 Responsive Privacy-Enhanced YouTube Player -->
          <div class="video-player-container">
            <iframe
              id="youtube-iframe"
              src="${activeVideo.embedUrl}"
              title="${escapeHtml(activeVideo.title)}"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          <!-- Video Metadata & Controls Bar -->
          <div class="video-controls-bar">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted);">
              <span>Channel: <strong id="video-display-channel" style="color: var(--text-primary);">${escapeHtml(activeVideo.channel)}</strong></span>
              <span>•</span>
              <span class="badge badge-slate" id="video-display-duration">${activeVideo.duration}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <a href="${activeVideo.watchUrl}" id="video-direct-link" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                Watch on YouTube ↗
              </a>
              <button type="button" class="btn ${videoRecord.watched ? 'btn-outline' : 'btn-primary'} btn-sm" id="toggle-watched-btn">
                ${videoRecord.watched ? '✓ Watched' : 'Mark as Watched'}
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="toggle-notes-btn">
                📝 Notes
              </button>
            </div>
          </div>

          <!-- Collapsible Video Notes -->
          <div id="video-notes-panel" style="display: ${videoRecord.notes ? 'block' : 'none'}; margin-top: var(--space-sm);">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.8rem;">Personal Video Notes & Key Timestamps:</label>
              <textarea id="video-notes-input" class="form-textarea" style="min-height: 60px;" placeholder="Record important syntax insights, video timestamps, or caveats...">${escapeHtml(videoRecord.notes || '')}</textarea>
              <span class="form-hint" id="video-notes-saved-status">Auto-saves locally</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Guided Example -->
      <div class="lesson-step-card" id="step-3">
        <div class="step-indicator">Step 3 • Guided Walkthrough</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-xs);">Guided Line-by-Line Example</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-sm);">
          Inspect this small, realistic program and note how each line executes.
        </p>

        <div class="lesson-code-box">
          <pre><code>${escapeHtml(lesson.guided_example.code)}</code></pre>
        </div>

        <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); margin-top: var(--space-md);">
          <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 6px;">
            Line-by-Line Breakdown:
          </div>
          <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-secondary);">
            ${lesson.guided_example.explanation_lines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: var(--space-md); padding: 10px 14px; background: #FFFDF8; border: 1px solid var(--milestone-border); border-radius: var(--radius-md);">
          <strong style="color: var(--milestone-accent); font-size: 0.88rem;">Independent Modification Challenge:</strong>
          <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 2px;">
            ${escapeHtml(lesson.guided_example.self_task)}
          </div>
        </div>
      </div>

      <!-- Step 4: Practical Implementation -->
      <div class="lesson-step-card" id="step-4">
        <div class="step-indicator">Step 4 • Hands-On Implementation</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-xs);">${escapeHtml(lesson.practical_task.title)}</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
          ${escapeHtml(lesson.practical_task.requirement)}
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-sm); margin-bottom: var(--space-md); font-size: 0.85rem;">
          <div style="background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-md);">
            <strong>Input:</strong>
            <pre style="margin-top: 4px; padding: 6px; font-size: 0.8rem; background: #0F172A; color: #FFF;"><code>${escapeHtml(lesson.practical_task.input)}</code></pre>
          </div>
          <div style="background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-md);">
            <strong>Expected Output:</strong>
            <pre style="margin-top: 4px; padding: 6px; font-size: 0.8rem; background: #0F172A; color: #FFF;"><code>${escapeHtml(lesson.practical_task.expected_output)}</code></pre>
          </div>
        </div>

        <div style="margin-bottom: var(--space-md);">
          <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 4px;">Business Rules & Acceptance Criteria:</div>
          <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-secondary);">
            ${lesson.practical_task.business_rules.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            ${lesson.practical_task.acceptance_criteria.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: var(--space-md);">
          <div style="font-weight: 600; font-size: 0.85rem; color: #DC2626; margin-bottom: 4px;">Edge Cases to Cover:</div>
          <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-secondary);">
            ${lesson.practical_task.edge_cases.map(ec => `<li>${escapeHtml(ec)}</li>`).join('')}
          </ul>
        </div>

        <!-- Progressive Hints System -->
        <div class="hints-accordion">
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Progressive Hints (Open only when stuck):</div>
          ${lesson.practical_task.hints.map((hint, idx) => `
            <div class="hint-item">
              <div class="hint-trigger" onclick="this.parentElement.classList.toggle('revealed')">
                <span>💡 Hint ${idx + 1}</span>
                <span>Click to Reveal</span>
              </div>
              <div class="hint-body">
                ${escapeHtml(hint)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step 5: Topic Question Bank -->
      <div class="lesson-step-card" id="step-5">
        <div class="step-indicator">Step 5 • Question Pack & Edge Cases</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-xs);">Topic Question Bank</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
          Targeted practice: 2 concept questions, 1 debugging question, 1 edge-case question, and 1 interview question.
        </p>

        <div id="questions-list">
          ${lesson.question_bank.map(q => `
            <div class="question-item-card">
              <div class="question-header">
                <span class="badge badge-teal">${escapeHtml(q.category)}</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; this.textContent = this.nextElementSibling.style.display === 'block' ? 'Hide Solution' : 'View Solution';">
                  View Solution
                </button>
                <div style="display: none; margin-top: 10px; padding: 12px; background: #F8FAFC; border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm); font-size: 0.88rem; width: 100%;">
                  <strong>Detailed Solution & Explanation:</strong>
                  <p style="margin-top: 4px; color: var(--text-primary); line-height: 1.5;">${escapeHtml(q.solution)}</p>
                </div>
              </div>
              <div style="font-weight: 600; font-size: 0.92rem; color: var(--text-primary); margin: 6px 0;">
                ${escapeHtml(q.question)}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                Clue: ${escapeHtml(q.hint)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step 6: Explain It Yourself -->
      <div class="lesson-step-card" id="step-6">
        <div class="step-indicator">Step 6 • Verbal & Written Retention</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-xs);">Explain It Yourself</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-sm);">
          ${escapeHtml(lesson.explain_yourself.prompt)}
        </p>

        <div style="background: var(--bg-subtle); padding: 10px 14px; border-radius: var(--radius-md); margin-bottom: var(--space-md); font-size: 0.82rem;">
          <strong>Structured Explanation Framework:</strong>
          <ul style="padding-left: 20px; margin-top: 4px; color: var(--text-secondary); margin-bottom: 0;">
            ${lesson.explain_yourself.structure.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
          </ul>
        </div>

        <div class="form-group">
          <label class="form-label" for="explanation-textarea">
            Your Personal Explanation & Reflection Notes:
          </label>
          <textarea id="explanation-textarea" class="form-textarea" placeholder="Explain in plain language as if explaining it to an engineering colleague or hiring manager...">${escapeHtml(progress.explanation_notes || '')}</textarea>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span class="form-hint" id="save-status-indicator">Auto-saves locally</span>
            <button type="button" class="btn btn-secondary btn-sm" id="save-notes-btn">
              Save Notes
            </button>
          </div>
        </div>
      </div>

      <!-- Step 7: Completion & Next Action -->
      <div class="lesson-step-card" id="step-7" style="background: #F8FAFC; border: 2px solid var(--accent-border);">
        <div class="step-indicator">Step 7 • Finalize & Next Step</div>
        <h3 style="font-size: 1.25rem; margin-bottom: var(--space-sm);">Record Your Completion</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-md);">
          Mark your progress based on actual understanding: concept understood, video watched, practical task attempted, and explanation recorded.
        </p>

        <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: center;">
          <button type="button" class="btn btn-primary btn-lg" id="mark-topic-completed-btn">
            ✓ Complete Topic & Next Action
          </button>
          <a href="#mentor" class="btn btn-secondary">
            ✨ Ask AI Mentor about this Topic
          </a>
          <a href="#roadmap/week/${lesson.week_number}" class="btn btn-outline">
            Return to Week Syllabus
          </a>
        </div>
      </div>
    </div>
  `;

  // Status Select Listener
  const statusSelect = container.querySelector('#topic-status-select');
  statusSelect.addEventListener('change', async () => {
    const newStatus = statusSelect.value;
    await saveTopicProgress(topicId, { status: newStatus });
    showToast(`Mastery status updated to: ${newStatus}`);
  });

  // Video Language Switcher
  const langEnBtn = container.querySelector('#lang-en-btn');
  const langHiBtn = container.querySelector('#lang-hi-btn');
  const iframe = container.querySelector('#youtube-iframe');
  const titleDisplay = container.querySelector('#video-display-title');
  const channelDisplay = container.querySelector('#video-display-channel');
  const durationDisplay = container.querySelector('#video-display-duration');
  const directLink = container.querySelector('#video-direct-link');

  const updateVideoLanguage = async (lang) => {
    currentLang = lang;
    langEnBtn.classList.toggle('active', lang === 'en');
    langHiBtn.classList.toggle('active', lang === 'hi');

    const selectedVideo = (lang === 'hi' && lesson.video?.hindi)
      ? lesson.video.hindi
      : (lesson.video?.primary || lesson.video?.hindi);

    iframe.src = selectedVideo.embedUrl;
    iframe.title = selectedVideo.title;
    titleDisplay.textContent = selectedVideo.title;
    channelDisplay.textContent = selectedVideo.channel;
    durationDisplay.textContent = selectedVideo.duration;
    directLink.href = selectedVideo.watchUrl;

    await saveVideoProgress(topicId, { language: lang });
  };

  langEnBtn.addEventListener('click', () => updateVideoLanguage('en'));
  langHiBtn.addEventListener('click', () => updateVideoLanguage('hi'));

  // Video Watched Toggle
  const toggleWatchedBtn = container.querySelector('#toggle-watched-btn');
  toggleWatchedBtn.addEventListener('click', async () => {
    const isNowWatched = !videoRecord.watched;
    videoRecord.watched = isNowWatched;

    await saveVideoProgress(topicId, {
      watched: isNowWatched,
      completed_at: isNowWatched ? new Date().toISOString() : null
    });

    if (isNowWatched) {
      toggleWatchedBtn.className = 'btn btn-outline btn-sm';
      toggleWatchedBtn.textContent = '✓ Watched';
      // Automatically advance status to at least 'read-watched' if currently 'not-started'
      if (statusSelect.value === 'not-started') {
        statusSelect.value = 'read-watched';
        await saveTopicProgress(topicId, { status: 'read-watched' });
      }
      showToast('Video marked as watched!');
    } else {
      toggleWatchedBtn.className = 'btn btn-primary btn-sm';
      toggleWatchedBtn.textContent = 'Mark as Watched';
      showToast('Video watch status removed.');
    }
  });

  // Toggle Video Notes Panel
  const toggleNotesBtn = container.querySelector('#toggle-notes-btn');
  const videoNotesPanel = container.querySelector('#video-notes-panel');
  const videoNotesInput = container.querySelector('#video-notes-input');
  const videoNotesStatus = container.querySelector('#video-notes-saved-status');

  toggleNotesBtn.addEventListener('click', () => {
    const isVisible = videoNotesPanel.style.display !== 'none';
    videoNotesPanel.style.display = isVisible ? 'none' : 'block';
  });

  let videoNotesTimer;
  videoNotesInput.addEventListener('input', () => {
    videoNotesStatus.textContent = 'Saving notes...';
    clearTimeout(videoNotesTimer);
    videoNotesTimer = setTimeout(async () => {
      await saveVideoProgress(topicId, { notes: videoNotesInput.value });
      videoNotesStatus.textContent = 'Notes saved at ' + new Date().toLocaleTimeString();
    }, 800);
  });

  // Notes Auto-save & Save button for Explanation
  const notesTextarea = container.querySelector('#explanation-textarea');
  const saveNotesBtn = container.querySelector('#save-notes-btn');
  const statusIndicator = container.querySelector('#save-status-indicator');

  let debounceTimer;
  notesTextarea.addEventListener('input', () => {
    statusIndicator.textContent = 'Saving...';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await saveTopicProgress(topicId, { explanation_notes: notesTextarea.value });
      statusIndicator.textContent = 'Saved locally at ' + new Date().toLocaleTimeString();
    }, 800);
  });

  saveNotesBtn.addEventListener('click', async () => {
    await saveTopicProgress(topicId, { explanation_notes: notesTextarea.value });
    showToast('Explanation notes saved!');
    statusIndicator.textContent = 'Saved locally at ' + new Date().toLocaleTimeString();
  });

  // Mark Completed Button
  const completeBtn = container.querySelector('#mark-topic-completed-btn');
  completeBtn.addEventListener('click', async () => {
    await saveTopicProgress(topicId, {
      status: 'completed',
      explanation_notes: notesTextarea.value,
      completed_at: new Date().toISOString()
    });
    statusSelect.value = 'completed';
    showToast('Congratulations! Topic marked as completed.');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

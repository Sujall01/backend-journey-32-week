/**
 * communication-page.js - Speaking, Communication & Confidence Companion
 * 1. Daily 15-minute routine guide (2m relax, 3m read aloud, 4m explain concept, 3m record/review, 3m interview Q)
 * 2. 5-step technical explanation framework
 * 3. Client-side local audio recorder
 * 4. Self-assessment log with 1-5 scales (Clarity, Pace, Sentence completion, Filler words, Confidence)
 * 5. Practice prompt catalog
 * 6. Responsible health & speech guidance notice
 */

import { LocalAudioRecorder } from '../components/audio-recorder.js';
import { getSpeakingLogs, saveSpeakingLog } from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderCommunication(container) {
  const speakingLogs = await getSpeakingLogs();

  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Confidence & Articulation
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">Technical Communication Practice</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 750px;">
            A supportive space to practice speaking slowly, completing full sentences, and explaining technical architectures with calm authority.
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-hover);">${speakingLogs.length}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Practice Sessions Logged</div>
        </div>
      </div>

      <!-- Health Guidance Notice (Responsible, Separated Medical Note) -->
      <div class="alert-box alert-medical" style="margin-bottom: var(--space-lg);">
        <div>
          <strong>Medical & Speech Health Guidance Note:</strong>
          <p style="margin-top: 4px; font-size: 0.85rem; line-height: 1.5;">
            This tool is designed purely for software engineering interview and presentation practice; it does not diagnose or treat speech, articulation, swallowing, or saliva conditions. If you experience persistent unclear speech, difficulty articulating words, or excessive saliva, please seek clinical evaluation from a qualified physician or certified Speech-Language Pathologist (SLP).
          </p>
          <p style="margin-top: 4px; font-size: 0.82rem; font-weight: 600;">
            🚨 EMERGENCY WARNING: Any sudden onset of slurred speech—especially if accompanied by facial drooping, arm weakness, numbness, or sudden confusion—is a potential medical emergency (FAST signs of stroke) and requires immediate emergency medical attention.
          </p>
        </div>
      </div>

      <!-- 15-Minute Daily Routine Breakdown -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <div>
            <span class="badge badge-teal">Daily 15-Minute Habit</span>
            <h2 style="font-size: 1.3rem; margin-top: 4px;">Structured Daily Speaking Routine</h2>
            <div class="card-subtitle">Included directly in your 12-hour weekly study schedule.</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-sm); margin-top: var(--space-sm);">
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--accent-hover); font-size: 0.9rem;">1. 2 Minutes</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 2px;"><strong>Relax & Breathe:</strong> Drop shoulders, breathe slowly, un-clench jaw.</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--accent-hover); font-size: 0.9rem;">2. 3 Minutes</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 2px;"><strong>Read Aloud:</strong> Read technical documentation slowly, enunciating each word.</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--accent-hover); font-size: 0.9rem;">3. 4 Minutes</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 2px;"><strong>Structure Concept:</strong> Map out What, Why, How, Example, and Limitations.</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--accent-hover); font-size: 0.9rem;">4. 3 Minutes</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 2px;"><strong>Record & Review:</strong> Record voice below and evaluate clarity and pacing.</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md);">
            <div style="font-weight: 700; color: var(--accent-hover); font-size: 0.9rem;">5. 3 Minutes</div>
            <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 2px;"><strong>Interview Answer:</strong> Answer one HR or architectural question.</div>
          </div>
        </div>
      </div>

      <!-- 5-Step Explanation Framework -->
      <div class="card" style="margin-bottom: var(--space-lg); background: #FFFDF8; border-left: 4px solid var(--milestone-accent);">
        <h3 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 6px;">
          The 5-Step Technical Explanation Framework
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-sm);">
          Whenever asked about any technical concept or architecture in an interview, structure your answer in these 5 exact steps:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 0.85rem;">
          <div style="background: #FFFFFF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong>1. What is it?</strong><br>A clear 1-sentence plain-English definition without buzzwords.
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong>2. Why is it needed?</strong><br>The concrete problem it solves and what goes wrong without it.
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong>3. How does it work?</strong><br>The internal mechanism (data structure, runtime lifecycle, or protocol).
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong>4. Practical Example:</strong><br>A real-world example from your ERP background (Staff, Fee, Payroll).
          </div>
          <div style="background: #FFFFFF; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong>5. Trade-offs:</strong><br>Limitations, when NOT to use it, or alternative approaches.
          </div>
        </div>
      </div>

      <!-- Audio Recorder & Self-Assessment Section -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <div>
            <h3 class="card-title">Practice & Audio Self-Reflection</h3>
            <div class="card-subtitle">Choose a prompt, record yourself speaking for 2–3 minutes, and log a simple self-rating.</div>
          </div>
        </div>

        <div style="margin-bottom: var(--space-md);">
          <label class="form-label" for="prompt-select">Select Practice Prompt / Topic:</label>
          <select id="prompt-select" class="form-select">
            <option value="Self-Introduction linking ERP Web Forms to modern ASP.NET Core">1. Self-Introduction: Linking ERP Experience to Modern .NET Backend</option>
            <option value="Module Ownership: Explaining the Staff & Leave Management System">2. Module Ownership: How I Designed the Staff & Leave Management System</option>
            <option value="Why Decimal is Mandatory for ERP Payroll vs Double">3. Technical Concept: Why Decimal is Mandatory for Payroll vs Double</option>
            <option value="Explaining Dictionary O(1) Lookups & Hash Collisions">4. DSA Concept: How Hash Tables Work and What Causes O(n) Degradation</option>
            <option value="Solving the EF Core N+1 Query Problem in Production">5. Debugging Scenario: Finding and Fixing an N+1 Query in Production</option>
            <option value="Explaining Multi-Tenant Isolation with EF Core Global Filters">6. System Design: Multi-Tenant Data Isolation and Security</option>
            <option value="Handling Production Incidents & Slow Database Queries">7. Behavioral: How I Handled an Urgent Production Performance Incident</option>
          </select>
        </div>

        <!-- Audio Recorder Mount Point -->
        <div id="audio-recorder-mount" style="margin-bottom: var(--space-lg);"></div>

        <!-- Self Assessment Form -->
        <form id="speaking-log-form" style="background: #FAFAF8; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: var(--space-md);">
          <h4 style="font-size: 1rem; margin-bottom: 6px;">Self-Reflection Ratings (1 = Needs Work, 5 = Excellent)</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md);">
            Rate yourself honestly. There is no automated judgement; consistent awareness builds natural speaking habits over time.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-md);">
            <div>
              <label class="form-label">1. Speaking Pace (Slow & Deliberate)</label>
              <div class="rating-scale" data-field="pace">
                ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="rating-btn ${v === 3 ? 'active' : ''}" data-val="${v}">${v}</button>`).join('')}
              </div>
            </div>

            <div>
              <label class="form-label">2. Sentence Completion (No Trail-Offs)</label>
              <div class="rating-scale" data-field="completion">
                ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="rating-btn ${v === 3 ? 'active' : ''}" data-val="${v}">${v}</button>`).join('')}
              </div>
            </div>

            <div>
              <label class="form-label">3. Minimal Filler Words (Ums / Ahs)</label>
              <div class="rating-scale" data-field="fillers">
                ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="rating-btn ${v === 3 ? 'active' : ''}" data-val="${v}">${v}</button>`).join('')}
              </div>
            </div>

            <div>
              <label class="form-label">4. Technical Clarity & Structure</label>
              <div class="rating-scale" data-field="clarity">
                ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="rating-btn ${v === 3 ? 'active' : ''}" data-val="${v}">${v}</button>`).join('')}
              </div>
            </div>

            <div>
              <label class="form-label">5. Overall Calm Confidence</label>
              <div class="rating-scale" data-field="confidence">
                ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="rating-btn ${v === 3 ? 'active' : ''}" data-val="${v}">${v}</button>`).join('')}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="spk-notes">Session Reflection Notes:</label>
            <textarea id="spk-notes" class="form-textarea" placeholder="What felt smooth? Did you rush at the beginning? How can you structure your answer better next time?"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              ✓ Log Speaking Practice Session
            </button>
          </div>
        </form>
      </div>

      <!-- Historical Practice Logs Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Practice History & Self-Assessed Progress</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Topic / Question</th>
                <th>Pace</th>
                <th>Completion</th>
                <th>Fillers</th>
                <th>Clarity</th>
                <th>Confidence</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${speakingLogs.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--text-muted); padding: var(--space-lg);">
                    No speaking sessions recorded yet. Start with a 3-minute self-introduction practice today!
                  </td>
                </tr>
              ` : speakingLogs.map(log => `
                <tr>
                  <td style="font-size: 0.85rem;">${new Date(log.date).toLocaleDateString()}</td>
                  <td style="font-weight: 500; font-size: 0.85rem;">${escapeHtml(log.topic)}</td>
                  <td>${log.pace || 3}/5</td>
                  <td>${log.completion || 3}/5</td>
                  <td>${log.fillers || 3}/5</td>
                  <td>${log.clarity || 3}/5</td>
                  <td><strong style="color: var(--accent-hover);">${log.confidence || 3}/5</strong></td>
                  <td style="font-size: 0.82rem; color: var(--text-secondary); max-width: 250px;">${escapeHtml(log.notes || '—')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Mount Audio Recorder
  const recorderMount = container.querySelector('#audio-recorder-mount');
  let recordedSeconds = 0;
  new LocalAudioRecorder(recorderMount, (blob, seconds) => {
    recordedSeconds = seconds;
  });

  // Rating Scale Interaction
  const ratingValues = { pace: 3, completion: 3, fillers: 3, clarity: 3, confidence: 3 };

  container.querySelectorAll('.rating-scale').forEach(scale => {
    const field = scale.getAttribute('data-field');
    scale.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        scale.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ratingValues[field] = Number(btn.getAttribute('data-val'));
      });
    });
  });

  // Submit Form
  const form = container.querySelector('#speaking-log-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = container.querySelector('#prompt-select').value;
    const notes = container.querySelector('#spk-notes').value.trim();

    await saveSpeakingLog({
      topic: topic,
      notes: notes,
      duration_seconds: recordedSeconds,
      ...ratingValues
    });

    showToast('Speaking practice session logged locally!');
    await renderCommunication(container);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


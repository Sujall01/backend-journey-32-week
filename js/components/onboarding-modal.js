/**
 * onboarding-modal.js - Calm First-Time Welcome and Setup Modal
 */

import { saveUserSettings, getUserSettings } from '../storage.js';
import { showToast } from './notifications.js';

export async function checkAndShowOnboarding(onComplete) {
  const settings = await getUserSettings();
  if (settings && settings.onboarding_completed) {
    return; // Already onboarded
  }

  const modalHtml = `
    <div class="modal-overlay active" id="onboarding-modal">
      <div class="modal-content" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.5rem;">🌱</span>
            <h3 class="modal-title">Welcome to Your 32-Week Journey</h3>
          </div>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: var(--space-md); font-size: 0.95rem; color: var(--text-secondary);">
            This is a 32-week learning companion designed to transition your ERP software experience into strong backend engineering expertise in C#, ASP.NET Core, SQL Server, and DSA.
          </p>

          <div class="alert-box alert-info" style="margin-bottom: var(--space-md);">
            <span><strong>Guiding Principle:</strong> You do not need to finish everything today. Just complete the next planned step calmly and consistently.</span>
          </div>

          <form id="onboarding-form">
            <div class="form-group">
              <label class="form-label" for="ob-display-name">Your Preferred Name (optional)</label>
              <input type="text" id="ob-display-name" class="form-input" placeholder="e.g. Sujal" value="Sujal">
            </div>

            <div class="form-group">
              <label class="form-label" for="ob-start-date">Roadmap Start Date</label>
              <input type="date" id="ob-start-date" class="form-input" value="${new Date().toISOString().split('T')[0]}">
              <span class="form-hint">Used to calculate your current calendar week.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Weekly Time Commitment</label>
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent-hover);">
                <span>12 hours per week</span>
                <span class="badge badge-teal">Calm & Realistic</span>
              </div>
            </div>

            <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-md); margin-bottom: var(--space-md); font-size: 0.88rem;">
              <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Verified Default Configuration:</div>
              <ul style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 0;">
                <li><strong>Wednesday:</strong> Main learning day off (4 focused hours).</li>
                <li><strong>Mon, Tue, Thu, Fri:</strong> 1h 15m manageable sessions.</li>
                <li><strong>Sat, Sun:</strong> 1h 30m project & weekly review sessions.</li>
                <li><strong>Primary Track:</strong> C#, .NET, ASP.NET Core, SQL Server & DSA.</li>
                <li><strong>Secondary Track:</strong> Optional Go practice on Saturdays.</li>
              </ul>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: var(--space-sm); margin-top: var(--space-lg);">
              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                Start My 32-Week Journey →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHtml;
  document.body.appendChild(container);

  const form = document.getElementById('onboarding-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const displayName = document.getElementById('ob-display-name').value.trim() || 'Engineer';
    const startDate = document.getElementById('ob-start-date').value || new Date().toISOString().split('T')[0];

    const profileData = {
      display_name: displayName,
      start_date: startDate,
      weekly_target_hours: 12,
      wednesday_focus: true,
      primary_track: "C# / .NET / SQL Server / DSA",
      secondary_track: "Go (Optional)",
      onboarding_completed: true,
      created_at: new Date().toISOString()
    };

    await saveUserSettings(profileData);
    document.getElementById('onboarding-modal').remove();
    showToast(`Welcome, ${displayName}! Your 32-week roadmap is ready.`);
    if (typeof onComplete === 'function') onComplete();
  });
}


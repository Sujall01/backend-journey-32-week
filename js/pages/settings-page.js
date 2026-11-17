/**
 * settings-page.js - Profile Configuration, JSON Backup/Restore & Windows PWA Setup
 */

import {
  getUserSettings,
  saveUserSettings,
  exportFullBackupJSON,
  importFullBackupJSON,
  exportJobApplicationsCSV,
  resetAllData
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderSettings(container) {
  const settings = await getUserSettings() || {
    display_name: 'Engineer',
    start_date: new Date().toISOString().split('T')[0],
    weekly_target_hours: 12
  };

  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div>
        <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
          Local Configuration & Data
        </span>
        <h1 style="font-size: 1.75rem; margin-top: 2px;">Settings & Data Management</h1>
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 750px;">
          All progress is stored 100% locally on your machine in IndexedDB. No external servers or cloud accounts required.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-lg); margin-top: var(--space-lg);">
        <!-- Profile & Schedule Settings Form -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profile & Study Schedule</h3>
          </div>
          <form id="profile-settings-form">
            <div class="form-group">
              <label class="form-label" for="st-name">Display Name</label>
              <input type="text" id="st-name" class="form-input" value="${escapeHtml(settings.display_name || '')}">
            </div>

            <div class="form-group">
              <label class="form-label" for="st-start-date">Roadmap Start Date</label>
              <input type="date" id="st-start-date" class="form-input" value="${settings.start_date || new Date().toISOString().split('T')[0]}">
              <span class="form-hint">Adjust this to shift calendar week calculations without losing progress.</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="st-hours">Weekly Study Commitment (Hours)</label>
              <input type="number" id="st-hours" class="form-input" min="6" max="30" value="${settings.weekly_target_hours || 12}">
              <span class="form-hint">Default is 12 hours (Wednesday 4h + 1h15m weekdays + 1h30m weekends).</span>
            </div>

            <div style="margin-top: var(--space-md);">
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                Save Settings
              </button>
            </div>
          </form>
        </div>

        <!-- Data Backup, Restore & CSV Export -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Backup & Portability</h3>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--space-md); line-height: 1.5;">
            Export a full JSON backup of your progress, quiz scores, problem history, and job applications. You can restore this file at any time.
          </p>

          <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
            <button type="button" class="btn btn-primary" id="export-json-backup-btn">
              💾 Export Full JSON Backup
            </button>

            <div style="position: relative;">
              <input type="file" id="import-json-file-input" accept=".json" style="display: none;">
              <button type="button" class="btn btn-secondary" id="trigger-import-btn" style="width: 100%;">
                📥 Import Backup from JSON File
              </button>
            </div>

            <button type="button" class="btn btn-outline" id="export-csv-apps-btn">
              📊 Export Job Applications to CSV
            </button>
          </div>

          <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-light); padding-top: var(--space-md);">
            <h4 style="font-size: 0.95rem; color: #DC2626; margin-bottom: 4px;">Danger Zone: Reset All Data</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-sm);">
              Permanently clears all locally saved topics, quiz attempts, and job applications.
            </div>
            <button type="button" class="btn btn-danger btn-sm" id="reset-all-data-btn">
              Reset Application Data
            </button>
          </div>
        </div>

        <!-- Windows App & PWA Installation Guide -->
        <div class="card" style="grid-column: 1 / -1; background: #FFFDF8; border-left: 4px solid var(--milestone-accent);">
          <div class="card-header">
            <div>
              <span class="badge badge-amber">Windows Desktop App</span>
              <h3 class="card-title" style="margin-top: 4px;">Installing on Windows (Chrome & Microsoft Edge)</h3>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-md); font-size: 0.88rem; line-height: 1.6;">
            <div>
              <strong>1. Install via Microsoft Edge / Chrome:</strong>
              <p style="color: var(--text-secondary); margin-top: 4px;">
                Look at the browser address bar for the <strong>Install App icon (🖥️ or ➕)</strong>, or open the browser menu (three dots) → <em>Apps</em> → <em>Install this site as an app</em>.
              </p>
            </div>
            <div>
              <strong>2. Offline Standalone Window:</strong>
              <p style="color: var(--text-secondary); margin-top: 4px;">
                The platform opens in its own clean window without browser tabs, pins to your Windows Start Menu and Taskbar, and operates offline via Service Worker.
              </p>
            </div>
            <div>
              <strong>3. Running Locally from Shell:</strong>
              <p style="color: var(--text-secondary); margin-top: 4px;">
                In PowerShell, run <code>python -m http.server 8000</code> or <code>npx serve</code>, then navigate to <code>http://localhost:8000</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Profile form submission
  const profileForm = container.querySelector('#profile-settings-form');
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      display_name: container.querySelector('#st-name').value.trim() || 'Engineer',
      start_date: container.querySelector('#st-start-date').value,
      weekly_target_hours: Number(container.querySelector('#st-hours').value) || 12
    };
    await saveUserSettings(updated);
    showToast('Settings saved successfully!');
  });

  // Export JSON Backup
  const exportBtn = container.querySelector('#export-json-backup-btn');
  exportBtn.addEventListener('click', async () => {
    try {
      const json = await exportFullBackupJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Backend_Learning_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Full JSON backup downloaded safely!');
    } catch (err) {
      console.error(err);
      showToast('Export failed: ' + err.message, 'error');
    }
  });

  // Import JSON Backup
  const triggerImportBtn = container.querySelector('#trigger-import-btn');
  const fileInput = container.querySelector('#import-json-file-input');

  triggerImportBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('Importing a backup will replace your current learning records with the backup file data. Do you wish to continue?')) {
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await importFullBackupJSON(event.target.result);
        showToast('Backup successfully imported! Refreshing view...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        showToast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  });

  // Export CSV
  container.querySelector('#export-csv-apps-btn').addEventListener('click', async () => {
    const csv = await exportJobApplicationsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Job_Applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Job applications exported to CSV.');
  });

  // Reset Data
  container.querySelector('#reset-all-data-btn').addEventListener('click', async () => {
    const firstConfirm = confirm('ARE YOU SURE? This will permanently delete your local topic progress, quizzes, and applications.');
    if (firstConfirm) {
      const secondConfirm = confirm('FINAL CONFIRMATION: Reset all database records back to clean slate?');
      if (secondConfirm) {
        await resetAllData();
        showToast('All local data has been reset.');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


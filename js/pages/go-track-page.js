/**
 * go-track-page.js - Optional Go Secondary Learning Track
 * Lightweight supplementary track for Saturday practice sessions.
 */

import { GO_TRACK_MODULES } from '../data/go-track-data.js';

export function renderGoTrack(container) {
  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div>
        <span class="badge badge-teal">Optional Supplementary Track</span>
        <h1 style="font-size: 1.75rem; margin-top: 4px;">Go (Golang) Secondary Track</h1>
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 750px;">
          Learn Go as a secondary cloud-native skill on Saturday sessions without competing with or disrupting your primary C# / .NET / SQL Server curriculum.
        </p>
      </div>

      <div class="alert-box alert-info" style="margin-top: var(--space-md);">
        <div>
          <strong>Curriculum Guardrail:</strong> Your primary target is Backend Software Engineer (.NET/C#). Go is treated as an optional secondary specialization. Allocate 30–45 minutes on Saturdays during your project session.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-lg); margin-top: var(--space-lg);">
        ${GO_TRACK_MODULES.map((mod, idx) => `
          <div class="card" style="border-left: 4px solid #00ADD8;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
              <div>
                <span class="badge badge-slate">${escapeHtml(mod.suggested_weeks)}</span>
                <h3 style="font-size: 1.25rem; margin-top: 4px; color: var(--text-primary);">
                  Module ${idx + 1}: ${escapeHtml(mod.title)}
                </h3>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(mod.phase)}</div>
              </div>
            </div>

            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin: var(--space-md) 0;">
              ${escapeHtml(mod.description)}
            </p>

            <div style="margin-bottom: var(--space-md);">
              <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 6px;">Core Language Concepts:</h4>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${mod.topics.map(t => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); font-size: 0.85rem;">
                    <span>• ${escapeHtml(t.title)}</span>
                    <a href="${t.docs}" target="_blank" rel="noopener noreferrer" style="font-size: 0.78rem;">Official Tour / Docs ↗</a>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="background: #FFFDF8; border: 1px solid var(--milestone-border); padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.88rem;">
              <strong style="color: var(--milestone-accent);">Saturday Micro-Task:</strong>
              <div style="color: var(--text-secondary); margin-top: 2px;">${escapeHtml(mod.milestone_task)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


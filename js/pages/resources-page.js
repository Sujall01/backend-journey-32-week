/**
 * resources-page.js - Verified Learning Resources Directory
 * Primary documentation, practice tracks, and competitive coding platforms.
 */

import { LEARNING_RESOURCES } from '../data/resources-data.js';

export function renderResources(container) {
  let selectedCategory = 'ALL';

  const categories = ['ALL', ...new Set(LEARNING_RESOURCES.map(r => r.category))];

  const renderCards = () => {
    const filtered = selectedCategory === 'ALL'
      ? LEARNING_RESOURCES
      : LEARNING_RESOURCES.filter(r => r.category === selectedCategory);

    container.innerHTML = `
      <div style="margin-bottom: var(--space-lg);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Curated Directory
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">Topic-Wise Verified Learning Resources</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 750px;">
            Primary documentation, test-driven coding tracks, and reputable practice platforms. No bloated 20-link link dumps.
          </p>
        </div>

        <!-- Category Filters -->
        <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin: var(--space-md) 0;">
          ${categories.map(cat => `
            <button type="button" class="btn ${cat === selectedCategory ? 'btn-primary' : 'btn-secondary'} btn-sm cat-filter-btn" data-cat="${cat}">
              ${cat === 'ALL' ? 'All Platforms' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Resource Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md); margin-top: var(--space-md);">
          ${filtered.map(res => `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <span class="badge badge-teal">${escapeHtml(res.category)}</span>
                  <span class="badge badge-slate">${escapeHtml(res.type)}</span>
                </div>
                <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">
                  ${escapeHtml(res.name)}
                </h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-sm);">
                  ${escapeHtml(res.description)}
                </p>
                <div style="font-size: 0.82rem; background: var(--bg-subtle); padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
                  <strong style="color: var(--text-primary);">Recommended For:</strong> ${escapeHtml(res.recommended_for)}
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: var(--space-sm);">
                <span style="font-size: 0.78rem; color: var(--text-muted);">${res.access} • ${res.difficulty}</span>
                <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  Open Platform ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.cat-filter-btn').forEach(b => {
      b.addEventListener('click', () => {
        selectedCategory = b.getAttribute('data-cat');
        renderCards();
      });
    });
  };

  renderCards();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


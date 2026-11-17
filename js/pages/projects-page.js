/**
 * projects-page.js - Enterprise Flagship Projects & Portfolio Tracker
 * 1. Indian Payroll and Salary Calculation Engine
 * 2. Staff and Leave Management API
 * 3. Multi-Tenant ERP Backend Platform
 * Interactive task check-offs (Core vs Advanced), database schema tables,
 * README completion checklists, architecture diagrams, and interview talking points.
 */

import { ENTERPRISE_PROJECTS } from '../data/projects-data.js';
import { getProjectTasks, setProjectTask } from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderProjects(container) {
  const taskStatusMap = await getProjectTasks();

  let projectsHtml = '';

  for (const proj of ENTERPRISE_PROJECTS) {
    const coreTasks = proj.tasks.filter(t => t.category === 'Core');
    const advTasks = proj.tasks.filter(t => t.category === 'Advanced');

    const coreDone = coreTasks.filter(t => taskStatusMap[t.id]).length;
    const advDone = advTasks.filter(t => taskStatusMap[t.id]).length;
    const totalDone = coreDone + advDone;
    const totalTasks = proj.tasks.length;
    const percent = Math.round((totalDone / totalTasks) * 100);

    projectsHtml += `
      <div class="project-card-large" id="${proj.id}">
        <div class="project-hero">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-sm);">
            <div>
              <span class="badge badge-amber">${escapeHtml(proj.roadmap_phase)}</span>
              <h2 style="font-size: 1.5rem; margin-top: 6px; color: var(--text-primary);">${escapeHtml(proj.title)}</h2>
              <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 2px;">
                ${escapeHtml(proj.subtitle)}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--accent-hover);">${percent}%</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${totalDone} of ${totalTasks} Tasks Completed</div>
            </div>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: var(--space-md);">
            ${proj.tech_stack.map(st => `<span class="badge badge-slate">${escapeHtml(st)}</span>`).join('')}
          </div>
        </div>

        <div style="padding: var(--space-lg);">
          <!-- Business Problem -->
          <div style="background: var(--bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: var(--space-md);">
            <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase;">Business Problem & Value:</div>
            <p style="font-size: 0.92rem; color: var(--text-primary); margin-top: 4px; line-height: 1.5;">
              ${escapeHtml(proj.business_problem)}
            </p>
          </div>

          <!-- Legal / Statutory Notice Banner if applicable -->
          ${proj.legal_statutory_note ? `
            <div class="alert-box alert-warning" style="font-size: 0.85rem; margin-bottom: var(--space-md);">
              <div>
                <strong>Statutory Compliance Notice:</strong> ${escapeHtml(proj.legal_statutory_note)}
              </div>
            </div>
          ` : ''}

          <!-- Architecture Diagram Accordion -->
          <div class="accordion-item" style="margin-bottom: var(--space-md);">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
              <span>📐 System Architecture & Data Flow</span>
              <span class="accordion-chevron">▼</span>
            </div>
            <div class="accordion-body">
              <pre style="margin: 0; background: #0F172A; color: #E2E8F0; font-size: 0.85rem; border-radius: var(--radius-sm); line-height: 1.4;"><code>${escapeHtml(proj.architecture_overview.trim())}</code></pre>
            </div>
          </div>

          <!-- Relational Database Schema Accordion -->
          <div class="accordion-item" style="margin-bottom: var(--space-md);">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
              <span>🗄️ Relational Database Schema (${proj.database_schema.length} Tables)</span>
              <span class="accordion-chevron">▼</span>
            </div>
            <div class="accordion-body">
              <div class="table-responsive">
                <table class="data-table" style="font-size: 0.85rem;">
                  <thead>
                    <tr>
                      <th>Table Name</th>
                      <th>Columns & Primary/Foreign Keys</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${proj.database_schema.map(tbl => `
                      <tr>
                        <td><strong>${escapeHtml(tbl.table)}</strong></td>
                        <td><code>${escapeHtml(tbl.columns)}</code></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Edge Cases Handled -->
          <div style="margin-bottom: var(--space-md);">
            <h4 style="font-size: 0.95rem; color: #B45309; margin-bottom: 6px;">Critical Edge Cases & Boundary Handling:</h4>
            <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
              ${proj.edge_cases.map(ec => `<li>${escapeHtml(ec)}</li>`).join('')}
            </ul>
          </div>

          <!-- Tasks Breakdown: Core vs Advanced Checklists -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-top: var(--space-lg);">
            <!-- Core Tasks -->
            <div style="background: #FAFAF8; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: var(--space-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="font-size: 0.95rem; color: var(--text-primary);">Required Core Tasks</h4>
                <span class="badge badge-teal">${coreDone} / ${coreTasks.length}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
                Must be finished for a working MVP version.
              </div>
              <div>
                ${coreTasks.map(t => `
                  <div class="task-checklist-item">
                    <input type="checkbox" class="task-check-input" id="${t.id}" data-task-id="${t.id}" data-proj-id="${proj.id}" ${taskStatusMap[t.id] ? 'checked' : ''}>
                    <label for="${t.id}" style="font-size: 0.85rem; color: var(--text-primary); cursor: pointer;">
                      ${escapeHtml(t.title)}
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Advanced Tasks -->
            <div style="background: #FFFDF8; border: 1px solid var(--milestone-border); border-radius: var(--radius-md); padding: var(--space-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="font-size: 0.95rem; color: var(--milestone-accent);">Advanced Engineering Tasks</h4>
                <span class="badge badge-amber">${advDone} / ${advTasks.length}</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
                Optional depth (arrears, concurrency tokens, outbox).
              </div>
              <div>
                ${advTasks.map(t => `
                  <div class="task-checklist-item">
                    <input type="checkbox" class="task-check-input" id="${t.id}" data-task-id="${t.id}" data-proj-id="${proj.id}" ${taskStatusMap[t.id] ? 'checked' : ''}>
                    <label for="${t.id}" style="font-size: 0.85rem; color: var(--text-primary); cursor: pointer;">
                      ${escapeHtml(t.title)}
                    </label>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- README Checklist & Interview Talking Points -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-top: var(--space-md);">
            <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
              <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 6px;">GitHub README Quality Checklist</h4>
              <ul style="padding-left: 20px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                ${proj.readme_checklist.map(rc => `<li>${escapeHtml(rc)}</li>`).join('')}
              </ul>
            </div>
            <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md);">
              <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 6px;">Enterprise Interview Talking Points</h4>
              <ul style="padding-left: 20px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                ${proj.interview_talking_points.map(itp => `<li>${escapeHtml(itp)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div>
        <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
          Enterprise Portfolio
        </span>
        <h1 style="font-size: 1.75rem; margin-top: 2px;">Flagship Projects Tracker</h1>
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 750px;">
          Three production-grade enterprise projects built with genuine business problem domains (Indian Payroll Engine, Staff & Leave API, Multi-Tenant ERP Platform).
        </p>
      </div>

      <div class="alert-box alert-info" style="margin-top: var(--space-md);">
        <div>
          <strong>Engineering Philosophy:</strong> Build a clean, functioning core version first before moving into advanced tasks. Every project here directly demonstrates senior backend capabilities for MNC interviews.
        </div>
      </div>

      <div style="margin-top: var(--space-lg);">
        ${projectsHtml}
      </div>
    </div>
  `;

  // Checkbox Event Listeners for Task Tracking
  container.querySelectorAll('.task-check-input').forEach(chk => {
    chk.addEventListener('change', async () => {
      const taskId = chk.getAttribute('data-task-id');
      const projId = chk.getAttribute('data-proj-id');
      const isCompleted = chk.checked;
      await setProjectTask(taskId, isCompleted, projId);
      showToast(isCompleted ? 'Task marked as completed!' : 'Task uncompleted.');
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


/**
 * career-page.js - Job Application Tracker & Developer Profile Hub
 * 1. Practical Job Application Tracker with 10 statuses, filters, search, CSV export
 * 2. Developer Profile & Public Proof (LeetCode, HackerRank, CodeChef/Codeforces)
 * 3. LinkedIn Visibility & Bi-Weekly Post Milestones
 * 4. 32-Week Career Action Progression Plan
 */

import {
  getJobApplications,
  saveJobApplication,
  deleteJobApplication,
  exportJobApplicationsCSV,
  getExternalProfiles,
  saveExternalProfile,
  getLinkedInPosts,
  saveLinkedInPost
} from '../storage.js';
import { showToast } from '../components/notifications.js';

export async function renderCareer(container, initialTab = 'applications') {
  container.innerHTML = `
    <div style="margin-bottom: var(--space-lg);">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <div>
          <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary);">
            Career & Execution Strategy
          </span>
          <h1 style="font-size: 1.75rem; margin-top: 2px;">Career Development & Job Tracker</h1>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">
            Track applications, maintain public coding proof honestly, refine your LinkedIn profile, and prepare for MNC interviews.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs-nav">
        <button type="button" class="tab-btn ${initialTab === 'applications' ? 'active' : ''}" data-tab="applications">
          💼 Job Applications Tracker
        </button>
        <button type="button" class="tab-btn ${initialTab === 'profiles' ? 'active' : ''}" data-tab="profiles">
          ⭐ Developer Profile & Public Proof
        </button>
        <button type="button" class="tab-btn ${initialTab === 'linkedin' ? 'active' : ''}" data-tab="linkedin">
          🌐 LinkedIn & Visibility Milestones
        </button>
        <button type="button" class="tab-btn ${initialTab === 'roadmap' ? 'active' : ''}" data-tab="roadmap">
          🗺️ Career Action Progression Plan
        </button>
      </div>

      <div id="career-tab-content"></div>
    </div>
  `;

  const tabs = container.querySelectorAll('.tab-btn');
  const tabContent = container.querySelector('#career-tab-content');

  const switchTab = async (tabName) => {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
    if (tabName === 'applications') await renderApplicationsTab(tabContent);
    else if (tabName === 'profiles') await renderProfilesTab(tabContent);
    else if (tabName === 'linkedin') await renderLinkedInTab(tabContent);
    else if (tabName === 'roadmap') renderCareerRoadmapTab(tabContent);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
  });

  await switchTab(initialTab);
}

/* ==========================================================================
   Tab 1: Job Applications Tracker
   ========================================================================== */
async function renderApplicationsTab(container) {
  const applications = await getJobApplications();

  // Compute metrics
  const totalApps = applications.length;
  const activeApps = applications.filter(a => !['Rejected', 'Closed', 'Saved'].includes(a.status)).length;
  const upcomingInterviews = applications.filter(a => a.interview_date && new Date(a.interview_date) >= new Date()).length;
  const offersCount = applications.filter(a => a.status === 'Offer').length;

  container.innerHTML = `
    <!-- Top Stats Ribbon -->
    <div class="career-stats-bar">
      <div class="career-stat-tile">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${totalApps}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Total Applications</div>
      </div>
      <div class="career-stat-tile">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-hover);">${activeApps}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Active In Pipeline</div>
      </div>
      <div class="career-stat-tile">
        <div style="font-size: 1.5rem; font-weight: 700; color: #2563EB;">${upcomingInterviews}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Upcoming Interviews</div>
      </div>
      <div class="career-stat-tile">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--status-completed);">${offersCount}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Offers Received</div>
      </div>
    </div>

    <!-- Action Bar: Add, Search, Filter, Export CSV -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-md);">
      <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
        <input type="text" id="app-search-input" class="form-input" placeholder="Search company or title..." style="width: 220px; padding: 6px 12px; font-size: 0.88rem;">
        <select id="app-status-filter" class="form-select" style="width: auto; padding: 6px 12px; font-size: 0.88rem;">
          <option value="ALL">All Statuses</option>
          <option value="Saved">Saved</option>
          <option value="To apply">To apply</option>
          <option value="Applied">Applied</option>
          <option value="Recruiter contacted">Recruiter contacted</option>
          <option value="Assessment">Assessment</option>
          <option value="Technical interview">Technical interview</option>
          <option value="HR interview">HR interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div style="display: flex; gap: var(--space-sm);">
        <button type="button" class="btn btn-secondary btn-sm" id="export-apps-csv-btn">
          📥 Export CSV
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="open-add-app-modal-btn">
          + Add Application
        </button>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="table-responsive">
      <table class="data-table" id="apps-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role & Tech Stack</th>
            <th>Location</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Follow-up / Interview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="apps-table-body">
          <!-- Rendered dynamically -->
        </tbody>
      </table>
    </div>

    <!-- Modal Container for Add/Edit -->
    <div id="app-modal-wrapper"></div>
  `;

  const tbody = container.querySelector('#apps-table-body');
  const searchInput = container.querySelector('#app-search-input');
  const statusFilter = container.querySelector('#app-status-filter');
  const addBtn = container.querySelector('#open-add-app-modal-btn');
  const exportCsvBtn = container.querySelector('#export-apps-csv-btn');
  const modalWrapper = container.querySelector('#app-modal-wrapper');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Offer': return '<span class="badge badge-green">★ Offer</span>';
      case 'Technical interview':
      case 'HR interview': return `<span class="badge badge-blue">${escapeHtml(status)}</span>`;
      case 'Assessment': return '<span class="badge badge-amber">Assessment</span>';
      case 'Applied': return '<span class="badge badge-teal">Applied</span>';
      case 'Recruiter contacted': return '<span class="badge badge-teal">Recruiter</span>';
      case 'Rejected': return '<span class="badge badge-red">Rejected</span>';
      case 'Closed': return '<span class="badge badge-slate">Closed</span>';
      default: return `<span class="badge badge-slate">${escapeHtml(status)}</span>`;
    }
  };

  const renderTableRows = () => {
    const query = searchInput.value.toLowerCase().trim();
    const filter = statusFilter.value;

    const filtered = applications.filter(app => {
      const matchesSearch = (app.company || '').toLowerCase().includes(query) || (app.title || '').toLowerCase().includes(query);
      const matchesStatus = filter === 'ALL' || app.status === filter;
      return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
            No job applications match your filters. Keep a steady pace of 1–3 well-matched applications per week.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(app => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(app.company)}</div>
          ${app.link ? `<a href="${escapeHtml(app.link)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem;">View Listing ↗</a>` : ''}
        </td>
        <td>
          <div style="font-weight: 500;">${escapeHtml(app.title)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.stack || '')}</div>
        </td>
        <td style="font-size: 0.85rem;">${escapeHtml(app.location || 'Remote/Hybrid')}</td>
        <td>${getStatusBadge(app.status)}</td>
        <td style="font-size: 0.85rem;">${app.applied_date ? new Date(app.applied_date).toLocaleDateString() : '—'}</td>
        <td style="font-size: 0.85rem;">
          ${app.interview_date ? `<strong style="color: #2563EB;">📅 ${new Date(app.interview_date).toLocaleDateString()}</strong>` : (app.followup_date ? `Follow-up: ${new Date(app.followup_date).toLocaleDateString()}` : '—')}
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn btn-secondary btn-sm edit-app-btn" data-id="${app.id}">Edit</button>
            <button type="button" class="btn btn-secondary btn-sm delete-app-btn" data-id="${app.id}" style="color: #DC2626;">✕</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row listeners
    tbody.querySelectorAll('.edit-app-btn').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-id'));
        const item = applications.find(a => a.id === id);
        if (item) openAppModal(item);
      });
    });

    tbody.querySelectorAll('.delete-app-btn').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.getAttribute('data-id'));
        if (confirm('Delete this application record?')) {
          await deleteJobApplication(id);
          showToast('Application deleted.');
          await renderApplicationsTab(container);
        }
      });
    });
  };

  searchInput.addEventListener('input', renderTableRows);
  statusFilter.addEventListener('change', renderTableRows);

  const openAppModal = (existing = null) => {
    modalWrapper.innerHTML = `
      <div class="modal-overlay active" id="app-form-modal">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h3 class="modal-title">${existing ? 'Edit Application' : 'Add New Application'}</h3>
            <button type="button" class="modal-close-btn" id="close-modal-btn">×</button>
          </div>
          <form id="app-entry-form">
            <div class="modal-body">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                <div class="form-group">
                  <label class="form-label" for="f-company">Company Name *</label>
                  <input type="text" id="f-company" class="form-input" required value="${escapeHtml(existing?.company || '')}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="f-title">Job Title *</label>
                  <input type="text" id="f-title" class="form-input" required placeholder="e.g. .NET Backend Engineer" value="${escapeHtml(existing?.title || '')}">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                <div class="form-group">
                  <label class="form-label" for="f-location">Location</label>
                  <input type="text" id="f-location" class="form-input" placeholder="e.g. Bangalore / Ahmedabad / Remote" value="${escapeHtml(existing?.location || '')}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="f-status">Application Status</label>
                  <select id="f-status" class="form-select">
                    ${['Saved', 'To apply', 'Applied', 'Recruiter contacted', 'Assessment', 'Technical interview', 'HR interview', 'Offer', 'Rejected', 'Closed'].map(s => `
                      <option value="${s}" ${existing?.status === s ? 'selected' : ''}>${s}</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                <div class="form-group">
                  <label class="form-label" for="f-date">Date Applied</label>
                  <input type="date" id="f-date" class="form-input" value="${existing?.applied_date || new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="f-interview-date">Interview Date (if scheduled)</label>
                  <input type="date" id="f-interview-date" class="form-input" value="${existing?.interview_date || ''}">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="f-link">Job Posting URL</label>
                <input type="url" id="f-link" class="form-input" placeholder="https://..." value="${escapeHtml(existing?.link || '')}">
              </div>

              <div class="form-group">
                <label class="form-label" for="f-stack">Technology Stack / Requirements</label>
                <input type="text" id="f-stack" class="form-input" placeholder="C#, ASP.NET Core, SQL Server, EF Core, Docker" value="${escapeHtml(existing?.stack || '')}">
              </div>

              <div class="form-group">
                <label class="form-label" for="f-notes">Interview Notes & Questions Asked</label>
                <textarea id="f-notes" class="form-textarea" placeholder="Record interview questions that were difficult, salary discussions, recruiter feedback...">${escapeHtml(existing?.notes || '')}</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cancel-modal-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Application</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const modal = modalWrapper.querySelector('#app-form-modal');
    const closeBtn = modalWrapper.querySelector('#close-modal-btn');
    const cancelBtn = modalWrapper.querySelector('#cancel-modal-btn');
    const form = modalWrapper.querySelector('#app-entry-form');

    const closeModal = () => modalWrapper.innerHTML = '';
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const appData = {
        ...(existing || {}),
        company: modalWrapper.querySelector('#f-company').value.trim(),
        title: modalWrapper.querySelector('#f-title').value.trim(),
        location: modalWrapper.querySelector('#f-location').value.trim(),
        status: modalWrapper.querySelector('#f-status').value,
        applied_date: modalWrapper.querySelector('#f-date').value,
        interview_date: modalWrapper.querySelector('#f-interview-date').value,
        link: modalWrapper.querySelector('#f-link').value.trim(),
        stack: modalWrapper.querySelector('#f-stack').value.trim(),
        notes: modalWrapper.querySelector('#f-notes').value.trim()
      };

      await saveJobApplication(appData);
      closeModal();
      showToast('Application saved!');
      await renderApplicationsTab(container);
    });
  };

  addBtn.addEventListener('click', () => openAppModal(null));

  exportCsvBtn.addEventListener('click', async () => {
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

  renderTableRows();
}

/* ==========================================================================
   Tab 2: Developer Profile & Public Proof (Honest Tracking)
   ========================================================================== */
async function renderProfilesTab(container) {
  const profiles = await getExternalProfiles();

  const leetcode = profiles['leetcode'] || { solved_total: 0, easy: 0, medium: 0, hard: 0, rating: '', profile_url: '' };
  const hackerrank = profiles['hackerrank'] || { sql_stars: 0, csharp_badge: '', profile_url: '', certs: '' };
  const codechef = profiles['codechef'] || { solved_total: 0, rating: '', profile_url: '' };

  container.innerHTML = `
    <div class="card" style="margin-bottom: var(--space-lg);">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Honest Developer Proof</span>
          <h2 style="font-size: 1.4rem; margin-top: 4px;">Competitive Coding & Platform Profiles</h2>
          <div class="card-subtitle">
            Track your verified problem counts and contest participation. Never fabricate stars or ratings.
          </div>
        </div>
      </div>

      <div class="alert-box alert-info">
        <div>
          <strong>MNC Verification Philosophy:</strong> Recruiters and engineering managers verify your LeetCode and GitHub profiles. A consistent history of 150–200 well-understood medium problems with clean complexity analysis is vastly more credible than fabricated streaks.
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-lg); margin-top: var(--space-lg);">
        <!-- LeetCode Card -->
        <div class="card" style="background: #FFFDF8; border-top: 4px solid #FFA116;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">LeetCode Profile</h3>
            <span class="badge badge-amber">Primary DSA Platform</span>
          </div>
          <form id="leetcode-form">
            <div class="form-group">
              <label class="form-label" for="lc-url">Public Profile URL</label>
              <input type="url" id="lc-url" class="form-input" placeholder="https://leetcode.com/u/your-username/" value="${escapeHtml(leetcode.profile_url || '')}">
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              <div class="form-group">
                <label class="form-label" for="lc-easy">Easy</label>
                <input type="number" id="lc-easy" class="form-input" min="0" value="${leetcode.easy || 0}">
              </div>
              <div class="form-group">
                <label class="form-label" for="lc-med">Medium</label>
                <input type="number" id="lc-med" class="form-input" min="0" value="${leetcode.medium || 0}">
              </div>
              <div class="form-group">
                <label class="form-label" for="lc-hard">Hard</label>
                <input type="number" id="lc-hard" class="form-input" min="0" value="${leetcode.hard || 0}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="lc-rating">Contest Rating (optional)</label>
              <input type="text" id="lc-rating" class="form-input" placeholder="e.g. 1650 (Knight) or empty" value="${escapeHtml(leetcode.rating || '')}">
            </div>
            <button type="submit" class="btn btn-secondary btn-sm" style="width: 100%;">
              Save LeetCode Stats
            </button>
          </form>
        </div>

        <!-- HackerRank Card -->
        <div class="card" style="background: #F0FDF4; border-top: 4px solid #00EA64;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
            <h3 style="font-size: 1.15rem; color: var(--text-primary);">HackerRank Profile</h3>
            <span class="badge badge-green">SQL & C# Badges</span>
          </div>
          <form id="hackerrank-form">
            <div class="form-group">
              <label class="form-label" for="hr-url">Public Profile URL</label>
              <input type="url" id="hr-url" class="form-input" placeholder="https://www.hackerrank.com/profile/..." value="${escapeHtml(hackerrank.profile_url || '')}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div class="form-group">
                <label class="form-label" for="hr-sql-stars">SQL Star Level (1–5)</label>
                <input type="number" id="hr-sql-stars" class="form-input" min="0" max="5" value="${hackerrank.sql_stars || 0}">
              </div>
              <div class="form-group">
                <label class="form-label" for="hr-certs">Skill Certifications</label>
                <input type="text" id="hr-certs" class="form-input" placeholder="e.g. SQL (Advanced)" value="${escapeHtml(hackerrank.certs || '')}">
              </div>
            </div>
            <button type="submit" class="btn btn-secondary btn-sm" style="width: 100%;">
              Save HackerRank Stats
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Form listeners
  container.querySelector('#leetcode-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const easy = Number(container.querySelector('#lc-easy').value) || 0;
    const med = Number(container.querySelector('#lc-med').value) || 0;
    const hard = Number(container.querySelector('#lc-hard').value) || 0;
    const data = {
      profile_url: container.querySelector('#lc-url').value.trim(),
      easy: easy,
      medium: med,
      hard: hard,
      solved_total: easy + med + hard,
      rating: container.querySelector('#lc-rating').value.trim()
    };
    await saveExternalProfile('leetcode', data);
    showToast('LeetCode statistics updated!');
  });

  container.querySelector('#hackerrank-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      profile_url: container.querySelector('#hr-url').value.trim(),
      sql_stars: Number(container.querySelector('#hr-sql-stars').value) || 0,
      certs: container.querySelector('#hr-certs').value.trim()
    };
    await saveExternalProfile('hackerrank', data);
    showToast('HackerRank statistics updated!');
  });
}

/* ==========================================================================
   Tab 3: LinkedIn Visibility & Post Drafts
   ========================================================================== */
async function renderLinkedInTab(container) {
  const posts = await getLinkedInPosts();

  // Curated professional milestone post templates based on real roadmap work
  const suggestedMilestones = [
    {
      title: "C# Value Types, Floating Point Pitfalls & Decimal in ERP Payroll",
      week: 4,
      draft: `Over the past month, I've been revisiting core C# fundamentals through the lens of enterprise ERP architecture.\n\nA fascinating insight: Why IEEE 754 binary floating-point (double/float) should never touch a payroll or billing engine. Because numbers like 0.1 cannot be represented precisely in base 2, micro-fractional errors accumulate over thousands of records and break statutory audit balance sheets.\n\nIn our Payroll Engine milestone, we enforced 128-bit decimal with MidpointRounding.AwayFromZero across all PF, ESI, and Professional Tax calculations.\n\n#CSharp #DotNet #BackendEngineering #SoftwareArchitecture`
    },
    {
      title: "Optimizing SQL Server & Solving the EF Core N+1 Query Problem",
      week: 12,
      draft: `In large-scale university ERP systems, the N+1 query problem is one of the quickest ways to degrade API response times from 30ms to 4 seconds.\n\nThis week, I benchmarked two approaches in EF Core:\n1. Eager loading with .Include()\n2. Explicit projection into clean DTOs with .Select()\n\nExplicit projection eliminated all unused columns from the T-SQL SELECT query, completely avoiding redundant memory overhead in the ChangeTracker (.AsNoTracking).\n\n#SQLServer #EFCore #DatabasePerformance #DotNetCore`
    },
    {
      title: "Building Multi-Tenant SaaS Isolation with EF Core Global Query Filters",
      week: 26,
      draft: `How do you guarantee that 50 universities sharing an ERP database never see each other's data?\n\nRather than relying on developers to remember 'WHERE TenantId = @id' in every single repository query, we implemented EF Core Global Query Filters combined with Scoped ITenantContext middleware.\n\nEvery LINQ query automatically appends the tenant boundary at the query compilation level, making cross-tenant data leaks impossible by design.\n\n#SystemDesign #MultiTenancy #SoftwareEngineering #CloudArchitecture`
    }
  ];

  container.innerHTML = `
    <div class="card" style="margin-bottom: var(--space-lg);">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Professional Visibility</span>
          <h2 style="font-size: 1.4rem; margin-top: 4px;">LinkedIn Developer Presence</h2>
          <div class="card-subtitle">
            Share genuine learning milestones every 2 weeks. Never auto-publish; copy or edit authentic drafts.
          </div>
        </div>
      </div>

      <!-- Profile Checklist -->
      <div style="background: var(--bg-subtle); padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 6px;">Profile Verification Checklist:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; font-size: 0.88rem;">
          <div>✓ Headline: Backend Engineer | .NET Core | C# | SQL Server</div>
          <div>✓ About Section: Linking ERP experience to modern backend</div>
          <div>✓ Featured: Links to GitHub Flagship Repositories</div>
          <div>✓ Skills: C#, ASP.NET Core, SQL Server, Docker, EF Core</div>
        </div>
      </div>

      <!-- Suggested Milestone Post Drafts -->
      <h3 style="font-size: 1.15rem; margin-bottom: var(--space-md);">Suggested Milestone Post Drafts (Based on Real Work)</h3>
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        ${suggestedMilestones.map((s, idx) => `
          <div class="card card-compact" style="background: #FAFAF8; border: 1px solid var(--border-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="badge badge-slate">Milestone ~ Week ${s.week}</span>
              <button type="button" class="btn btn-secondary btn-sm copy-post-btn" data-text="${escapeHtml(s.draft)}">
                📋 Copy Draft
              </button>
            </div>
            <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 6px;">${escapeHtml(s.title)}</h4>
            <pre style="background: #FFFFFF; color: var(--text-primary); border: 1px solid var(--border-subtle); padding: 12px; font-size: 0.85rem; border-radius: var(--radius-sm); white-space: pre-wrap; font-family: inherit; line-height: 1.5;">${escapeHtml(s.draft)}</pre>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.copy-post-btn').forEach(b => {
    b.addEventListener('click', () => {
      const text = b.getAttribute('data-text');
      navigator.clipboard.writeText(text);
      showToast('Post draft copied to clipboard! Review and publish on LinkedIn.');
    });
  });
}

/* ==========================================================================
   Tab 4: Career Action Progression Plan
   ========================================================================== */
function renderCareerRoadmapTab(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-teal">Strategic Execution</span>
          <h2 style="font-size: 1.4rem; margin-top: 4px;">32-Week Career Progression Timeline</h2>
          <div class="card-subtitle">Realistic, step-by-step career moves aligned with your technical roadmap.</div>
        </div>
      </div>

      <div class="alert-box alert-warning">
        <div>
          <strong>Golden Rule:</strong> Never resign from your current job without a verified, written employment offer with signed terms in hand.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-top: var(--space-md);">
        <div style="border-left: 4px solid var(--accent-primary); padding-left: 14px;">
          <h4 style="font-size: 1.05rem; color: var(--text-primary);">Weeks 1–4: Foundation & Resume Alignment</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            • Polish resume to showcase existing ERP experience (Staff, Fee, HR, Payroll) with clear ownership metrics.<br>
            • Create a target company and recruiter tracker.<br>
            • Apply selectively to 1–2 local .NET / C# roles to test resume response.
          </p>
        </div>

        <div style="border-left: 4px solid var(--accent-primary); padding-left: 14px;">
          <h4 style="font-size: 1.05rem; color: var(--text-primary);">Weeks 5–8: First Public Project</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            • Publish Payroll Console v1 on GitHub with comprehensive README.<br>
            • Share first learning post on LinkedIn regarding C# collections and decimal precision.<br>
            • Solve 3–4 SQL queries weekly on HackerRank to achieve intermediate star rank.
          </p>
        </div>

        <div style="border-left: 4px solid var(--accent-primary); padding-left: 14px;">
          <h4 style="font-size: 1.05rem; color: var(--text-primary);">Weeks 9–16: Modern API Transition</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            • Transition resume from Web Forms focus to ASP.NET Core Web API and EF Core.<br>
            • Complete Staff & Leave Management API with JWT and role authorization.<br>
            • Attend screening interviews and record questions that were challenging.
          </p>
        </div>

        <div style="border-left: 4px solid var(--accent-primary); padding-left: 14px;">
          <h4 style="font-size: 1.05rem; color: var(--text-primary);">Weeks 17–24: Tier-1 IT & MNC Outreach</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            • Highlight Clean Architecture, SQL Indexing, Docker, and CI/CD on LinkedIn.<br>
            • Ramp up targeted applications to 2–3 per week for established IT firms and MNCs.<br>
            • Conduct weekly 15-minute speaking practice on technical trade-offs.
          </p>
        </div>

        <div style="border-left: 4px solid var(--accent-primary); padding-left: 14px;">
          <h4 style="font-size: 1.05rem; color: var(--text-primary);">Weeks 25–32: Capstone & Offer Negotiation</h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
            • Present the Multi-Tenant ERP platform as your flagship capstone architecture.<br>
            • Full mock technical interviews (DSA, .NET internals, System Design).<br>
            • Evaluate written offers, notice period transition, and career growth trajectories.
          </p>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}


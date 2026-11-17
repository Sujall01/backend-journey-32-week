/**
 * router.js - Hash-Based Single-Page Application Router
 * Manages clean navigation, deep links, active link states, and view mounting.
 */

import { renderDashboard } from './pages/dashboard.js';
import { renderRoadmap } from './pages/roadmap-page.js';
import { renderTopicView } from './pages/topic-view.js';
import { renderPractice } from './pages/practice-page.js';
import { renderProjects } from './pages/projects-page.js';
import { renderCareer } from './pages/career-page.js';
import { renderCommunication } from './pages/communication-page.js';
import { renderWeeklyReview } from './pages/weekly-review-page.js';
import { renderResources } from './pages/resources-page.js';
import { renderGoTrack } from './pages/go-track-page.js';
import { renderSettings } from './pages/settings-page.js';
import { renderMentorPage } from './pages/mentor-page.js';
import { renderQuizHub } from './pages/quiz-hub.js';

export class AppRouter {
  constructor(contentContainer) {
    this.container = contentContainer;
    this.currentRoute = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || 'dashboard';
    const [path, ...params] = rawHash.split('/');

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    this.updateActiveNavLinks(path);

    try {
      if (path === 'dashboard' || path === 'home' || path === '') {
        document.title = 'Dashboard | 32-Week Backend Journey';
        await renderDashboard(this.container);
      }
      else if (path === 'roadmap') {
        if (params[0] === 'week' && params[1]) {
          document.title = `Week ${params[1]} Syllabus | 32-Week Backend Journey`;
          await renderRoadmap(this.container, params[1]);
        } else {
          document.title = '32-Week Roadmap | 32-Week Backend Journey';
          await renderRoadmap(this.container);
        }
      }
      else if (path === 'topic' && params[0]) {
        document.title = 'Topic Lesson | 32-Week Backend Journey';
        await renderTopicView(this.container, params[0]);
      }
      else if (path === 'practice') {
        document.title = 'Practice & Quizzes | 32-Week Backend Journey';
        const initialTab = params[0] || 'quizzes';
        await renderPractice(this.container, initialTab);
      }
      else if (path === 'projects') {
        document.title = 'Enterprise Flagship Projects | 32-Week Backend Journey';
        await renderProjects(this.container);
      }
      else if (path === 'career') {
        document.title = 'Career & Job Tracker | 32-Week Backend Journey';
        const initialTab = params[0] || 'applications';
        await renderCareer(this.container, initialTab);
      }
      else if (path === 'mentor') {
        document.title = 'AI Learning Mentor | 32-Week Backend Journey';
        await renderMentorPage(this.container);
      }
      else if (path === 'quiz' || path === 'ai-quiz') {
        document.title = 'AI Assessment & Quiz Lab | 32-Week Backend Journey';
        await renderQuizHub(this.container, params);
      }
      else if (path === 'communication') {
        document.title = 'Communication Practice | 32-Week Backend Journey';
        await renderCommunication(this.container);
      }
      else if (path === 'weekly-review') {
        document.title = 'Sunday Weekly Review | 32-Week Backend Journey';
        await renderWeeklyReview(this.container);
      }
      else if (path === 'resources') {
        document.title = 'Learning Resources | 32-Week Backend Journey';
        renderResources(this.container);
      }
      else if (path === 'go-track') {
        document.title = 'Go Secondary Track | 32-Week Backend Journey';
        renderGoTrack(this.container);
      }
      else if (path === 'settings') {
        document.title = 'Settings & Data Backup | 32-Week Backend Journey';
        await renderSettings(this.container);
      }
      else {
        // Fallback to dashboard
        window.location.hash = '#dashboard';
      }
    } catch (err) {
      console.error('Error rendering route:', err);
      this.container.innerHTML = `
        <div class="card" style="margin-top: var(--space-xl); border-left: 4px solid #DC2626;">
          <h3 style="color: #DC2626;">Rendering Error</h3>
          <p style="margin: var(--space-sm) 0;">An error occurred while loading this view: ${escapeHtml(err.message)}</p>
          <a href="#dashboard" class="btn btn-primary btn-sm">Return to Dashboard</a>
        </div>
      `;
    }
  }

  updateActiveNavLinks(activePath) {
    const mainLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    mainLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.replace('#', '').split('/')[0];
      if (linkPath === activePath || (activePath === '' && linkPath === 'dashboard')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Tools dropdown links
    const toolLinks = document.querySelectorAll('.tools-menu-item');
    toolLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.replace('#', '').split('/')[0];
      if (linkPath === activePath) {
        link.style.fontWeight = '700';
        link.style.color = 'var(--accent-hover)';
      } else {
        link.style.fontWeight = 'normal';
        link.style.color = 'var(--text-primary)';
      }
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

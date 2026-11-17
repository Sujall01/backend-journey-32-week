/**
 * app.js - Main Application Bootstrap
 * Registers Service Worker, checks onboarding, initializes Router,
 * handles header tools dropdown, and maintains global active state.
 */

import { AppRouter } from './router.js';
import { checkAndShowOnboarding } from './components/onboarding-modal.js';
import { getLastActiveTopic } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const contentArea = document.getElementById('main-content');
  const router = new AppRouter(contentArea);

  // Initialize service worker for offline support
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => {
          console.log('Backend32 Service Worker registered successfully:', reg.scope);
        })
        .catch(err => {
          console.warn('Service Worker registration skipped or failed:', err);
        });
    } catch (e) {
      console.warn('Service Worker registration exception:', e);
    }
  }

  // Header Tools Dropdown Logic
  const toolsBtn = document.getElementById('tools-menu-btn');
  const toolsMenu = document.getElementById('tools-dropdown-menu');

  if (toolsBtn && toolsMenu) {
    toolsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = toolsMenu.classList.toggle('open');
      toolsBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toolsMenu.contains(e.target) && e.target !== toolsBtn) {
        toolsMenu.classList.remove('open');
        toolsBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking a menu item
    toolsMenu.addEventListener('click', (e) => {
      if (e.target.closest('.tools-menu-item')) {
        toolsMenu.classList.remove('open');
        toolsBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toolsMenu.classList.contains('open')) {
        toolsMenu.classList.remove('open');
        toolsBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Update header continue action button
  async function refreshHeaderContinue() {
    const headerBtn = document.getElementById('header-continue-btn');
    if (!headerBtn) return;

    const last = await getLastActiveTopic();
    if (last && last.topic_id) {
      headerBtn.href = `#topic/${last.topic_id}`;
      headerBtn.style.display = 'inline-flex';
      const label = headerBtn.querySelector('span');
      if (label) label.textContent = `Resume W${last.week_number}`;
    } else {
      headerBtn.href = '#roadmap';
      headerBtn.style.display = 'inline-flex';
      const label = headerBtn.querySelector('span');
      if (label) label.textContent = 'Explore Roadmap';
    }
  }

  // Check onboarding modal
  await checkAndShowOnboarding(() => {
    refreshHeaderContinue();
    router.init();
  });

  await refreshHeaderContinue();
  router.init();

  window.addEventListener('hashchange', refreshHeaderContinue);
});

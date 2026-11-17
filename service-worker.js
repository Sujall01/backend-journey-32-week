// Service Worker for 32-Week Backend Engineering Learning Platform
const CACHE_NAME = 'backend32-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/pages.css',
  './js/app.js',
  './js/router.js',
  './js/storage.js',
  './js/data/roadmap-data.js',
  './js/data/topics-data.js',
  './js/data/quizzes-data.js',
  './js/data/challenges-data.js',
  './js/data/projects-data.js',
  './js/data/resources-data.js',
  './js/data/go-track-data.js',
  './js/components/onboarding-modal.js',
  './js/components/audio-recorder.js',
  './js/components/notifications.js',
  './js/pages/dashboard.js',
  './js/pages/roadmap-page.js',
  './js/pages/topic-view.js',
  './js/pages/practice-page.js',
  './js/pages/projects-page.js',
  './js/pages/career-page.js',
  './js/pages/communication-page.js',
  './js/pages/weekly-review-page.js',
  './js/pages/resources-page.js',
  './js/pages/go-track-page.js',
  './js/pages/settings-page.js',
  './js/pages/mentor-page.js',
  './js/pages/quiz-hub.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old service worker cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First with Cache Fallback (Ensures code edits load immediately without stale cache)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Never cache API proxy requests
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});


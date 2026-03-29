// FlashForge Service Worker — Cache-First Offline Strategy
const CACHE = 'flashforge-v12';

// Only local assets — external URLs (fonts) are cached dynamically on first fetch
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './anki-icon.png',
  './polnisch_anki.csv',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(res => {
        // Cache successful responses (own assets + fonts)
        if (res.ok) {
          const url = e.request.url;
          if (
            url.startsWith(self.location.origin) ||
            url.includes('fonts.googleapis.com') ||
            url.includes('fonts.gstatic.com')
          ) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
        }
        return res;
      }).catch(() => {
        // Offline fallback: serve index.html for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        // For font requests offline: return empty response (app still works)
        return new Response('', { status: 408 });
      });
    })
  );
});

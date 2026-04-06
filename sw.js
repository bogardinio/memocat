// FlashForge Service Worker — Cache-First Offline Strategy
const CACHE = 'flashforge-v19';

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

  // Intercept /audio/* requests — serve from IndexedDB
  const url = new URL(e.request.url);
  if (url.pathname.includes('/audio/')) {
    const filename = url.pathname.split('/audio/').pop();
    e.respondWith(
      getAudioFromDB(filename).then(blob => {
        if (!blob) return new Response('Not found', { status: 404 });
        return new Response(blob, {
          headers: {
            'Content-Type': blob.type || 'audio/mpeg',
            'Content-Length': blob.size,
            'Accept-Ranges': 'bytes',
          }
        });
      }).catch(err => new Response('DB error: ' + err, { status: 500 }))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(res => {
        // Cache successful responses (own assets + fonts)
        if (res.ok) {
          const reqUrl = e.request.url;
          if (
            reqUrl.startsWith(self.location.origin) ||
            reqUrl.includes('fonts.googleapis.com') ||
            reqUrl.includes('fonts.gstatic.com')
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

// Read audio blob from IndexedDB (shared with main app)
function getAudioFromDB(name) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('flashforge', 3);
    req.onsuccess = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audio')) { resolve(null); return; }
      const tx = db.transaction('audio', 'readonly');
      const get = tx.objectStore('audio').get(name);
      get.onsuccess = () => resolve(get.result ? get.result.blob : null);
      get.onerror = () => reject(get.error);
    };
    req.onerror = () => reject(req.error);
  });
}

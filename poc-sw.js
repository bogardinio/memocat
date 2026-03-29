// Minimal SW for audio PoC — intercepts /audio/* and serves from IndexedDB
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only intercept requests to ./audio/*
  if (!url.pathname.includes('/audio/')) return;

  const filename = url.pathname.split('/audio/').pop();
  e.respondWith(
    getAudioFromDB(filename).then(blob => {
      if (!blob) return new Response('Not found', { status: 404 });
      return new Response(blob, {
        headers: { 'Content-Type': blob.type || 'audio/mpeg' }
      });
    }).catch(() => new Response('DB error', { status: 500 }))
  );
});

function getAudioFromDB(name) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('poc-audio-test', 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore('audio', { keyPath: 'name' });
    };
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('audio', 'readonly');
      const get = tx.objectStore('audio').get(name);
      get.onsuccess = () => resolve(get.result ? get.result.blob : null);
      get.onerror = () => reject(get.error);
    };
    req.onerror = () => reject(req.error);
  });
}

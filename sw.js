// sw.js
const CACHE_NAME = 'gongjuzhan-v1'; // ⚠️ 每次更新内容后改版本号
const ASSETS_TO_CACHE = [
  '/gongjuzhan/',
  '/gongjuzhan/index.html',
  '/gongjuzhan/manifest.json',
  '/gongjuzhan/icon-192.png',
  '/gongjuzhan/icon-512.png',
  'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});

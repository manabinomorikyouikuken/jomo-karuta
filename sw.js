const CACHE_NAME = 'jomo-karuta-v2';
const APP_SCOPE = self.registration.scope;
const APP_SHELL = new URL('./', APP_SCOPE).href;
const MANIFEST_URL = new URL('manifest.webmanifest', APP_SCOPE).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([APP_SHELL, MANIFEST_URL]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('jomo-karuta-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const isAsset = url.pathname.includes('/assets/');
  const isManifest = url.pathname.endsWith('/manifest.webmanifest');

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(APP_SHELL)),
    );
    return;
  }

  if (isAsset || isManifest) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })),
    );
  }
});

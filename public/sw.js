const CACHE_NAME = 'mideessi-cache-v1';
const PDF_CACHE_NAME = 'mideessi-pdf-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.svg',
  '/site.webmanifest',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== PDF_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isPdf = requestUrl.pathname.includes('/api/proxy-pdf') || 
                requestUrl.pathname.endsWith('.pdf') ||
                (requestUrl.href.includes('cloudinary.com') && requestUrl.href.includes('pdf'));

  if (isPdf && event.request.method === 'GET') {
    event.respondWith(
      caches.open(PDF_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  cache.put(event.request, networkResponse);
                }
              })
              .catch(() => {});
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('Document non disponible hors ligne.', { status: 503 });
          });
        });
      })
    );
    return;
  }

  const isAsset = isSameOrigin && (ASSETS_TO_CACHE.includes(requestUrl.pathname) || requestUrl.pathname.startsWith('/assets/'));

  if (isAsset && event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  if (!isSameOrigin) {
    // Do not intercept cross-origin non-PDF requests; let the browser handle external resources directly.
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) return response;
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        return new Response('Contenu indisponible hors ligne.', { status: 503 });
      });
    })
  );
});

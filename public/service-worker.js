/**
 * Service Worker dédié à MIDEESSI
 * Gère le cache et répond aux demandes de ressources
 */

const CACHE_NAME = 'mideessi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/hero1.webp',
  '/hero2.webp',
  '/hero3.webp',
  '/mideessi.png',
  '/mideessi.webp',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker en cours d\'installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Service Worker cache ouvert');
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('⚠️ Certaines ressources n\'ont pas pu être cachées:', err);
        // Ne pas échouer l\'installation si certaines ressources ne peuvent pas être cachées
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activé');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes d\'extension Chrome
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Ne pas mettre en cache les réponses non-200
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Cloner la réponse
        const responseToCache = response.clone();

        // Mettre en cache les requêtes réussies
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Retourner la réponse en cache si la requête échoue
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Retourner une page d\'erreur si disponible
          return caches.match('/index.html');
        });
      });
    })
  );
});

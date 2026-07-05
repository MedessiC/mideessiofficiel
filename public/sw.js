// Service Worker désactivé - peut interférer avec l'auth Google OAuth et servir des assets périmés
// Pour réactiver, remplacez ce fichier par l'implémentation complète

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Supprimer tous les caches existants au moment de l'activation
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Ne rien intercepter - laisser le réseau gérer toutes les requêtes
self.addEventListener('fetch', () => {
  // Intentionnellement vide
});

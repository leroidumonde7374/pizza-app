const CACHE_NAME = 'pizzagramme-v4'; // Incrémentez à chaque mise à jour !

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',  // Corrigé : plus de dossier icons/
  './icon-512.png',
  './icon-ios.png'
];

// Installation et mise en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force l'activation immédiate
  );
});

// Activation et suppression des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle immédiatement
  );
});

// Stratégie : Cache first, puis réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne le cache si disponible, sinon fait une requête réseau
        return response || fetch(event.request).then((fetchResponse) => {
          // Met en cache les nouvelles ressources
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => {
        // Fallback en cas d'erreur (optionnel)
        console.log('Fetch failed');
      })
  );
});

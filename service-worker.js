self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('pizzagramme-v1').then(function(cache) {
      return cache.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./logo.svg']);
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
});

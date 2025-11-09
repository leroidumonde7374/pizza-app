self.addEventListener('install', e => {
  e.waitUntil(caches.open('pizza-cache').then(cache => {
    return cache.addAll(['./pizza.html','./manifest.json']);
  }));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});

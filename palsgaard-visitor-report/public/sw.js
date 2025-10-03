self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("palsgaard-v1").then((cache) =>
      cache.addAll(["/", "/manifest.webmanifest"])
    )
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

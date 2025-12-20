const CACHE = "evroute-shell-v1";
const ASSETS = [
  "/ev-route-chargers/",
  "/ev-route-chargers/index.html",
  "/ev-route-chargers/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Älä cacheta API-kutsuja tai karttatiiliä
  if (
    url.hostname.includes("openchargemap") ||
    url.hostname.includes("project-osrm") ||
    url.hostname.includes("openstreetmap") ||
    url.hostname.includes("vercel.app")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

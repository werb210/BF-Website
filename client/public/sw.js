// BF_WEBSITE_BLOCK_v317_SW_HARDENING_v1
// Bumped VERSION so all stale caches are invalidated on activate.
// Navigation fetch now treats non-2xx as failure so broken-deploy
// responses don't get cached or replayed.
const VERSION = "v2";
const STATIC_CACHE = `bf-static-${VERSION}`;
const RUNTIME_CACHE = `bf-runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = ["/", "/offline.html", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) =>
      Promise.all(
        STATIC_ASSETS.map((u) =>
          c.add(u).catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Kill switch — visiting any URL with ?sw=off unregisters this SW.
  if (url.searchParams.get("sw") === "off") {
    e.respondWith(
      self.registration.unregister().then(() =>
        new Response("Service worker unregistered. Reload this page.", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        })
      )
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) return;
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first, but only treat 2xx as success.
  // Non-2xx responses fall through to the OFFLINE_URL instead of being
  // cached or replayed — fixes the "stuck on 404" loop.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) return res;
          return caches.match(OFFLINE_URL).then(
            (r) => r || new Response("Offline", { status: 503 })
          );
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then(
            (r) => r || new Response("Offline", { status: 503 })
          )
        )
    );
    return;
  }

  // Static assets: cache-first, only cache 2xx basic responses.
  e.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached)
    )
  );
});

// BF_WEBSITE_BLOCK_1_36_PWA_SETUP
// BF_WEBSITE_v789_SW_BUILD_HASH - VERSION is replaced at build time by
// scripts/stamp-sw.ts with a hash of the build output, so every deploy gets
// fresh caches and the old ones are deleted on activate. It used to be a
// hand-edited "v16" that nobody bumped, so returning visitors kept stale files.
const VERSION = "__BF_BUILD_HASH__";
const STATIC_CACHE = `bf-static-${VERSION}`;
const RUNTIME_CACHE = `bf-runtime-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = ["/offline.html", "/manifest.webmanifest"];

// Always try the network first for these, so a deploy (new HTML pointing at
// new hashed bundles, a new sitemap, new llms.txt) is seen on the next visit.
const NETWORK_FIRST_PATHS = new Set(["/sitemap.xml", "/llms.txt", "/robots.txt"]);

function isNetworkFirst(req, url) {
  if (req.mode === "navigate") return true;
  if (NETWORK_FIRST_PATHS.has(url.pathname)) return true;
  if (url.pathname.endsWith(".html")) return true;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((c) =>
      Promise.all(
        STATIC_ASSETS.map((u) =>
          c.add(u).catch(() => {
            // Tolerate missing /offline.html on first install; runtime
            // cache will pick it up after the first navigation.
          })
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

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })
    .catch(() =>
      caches.match(req).then((cached) => {
        if (cached) return cached;
        if (req.mode === "navigate") {
          return caches.match(OFFLINE_URL).then((r) => r || new Response("Offline", { status: 503 }));
        }
        return new Response("Offline", { status: 503 });
      })
    );
}

function cacheFirst(req) {
  return caches.match(req).then(
    (cached) =>
      cached ||
      fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
  );
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/api/")) return;
  if (url.origin !== self.location.origin) return;
  e.respondWith(isNetworkFirst(req, url) ? networkFirst(req) : cacheFirst(req));
});

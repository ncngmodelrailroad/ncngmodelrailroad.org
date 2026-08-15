const CACHE_PREFIX = "ncngrr-";
const CACHE_VERSION = `${CACHE_PREFIX}v4`;
const SHELL_ASSETS = Object.freeze([
  "./styles.min.css?v=7bc9dd92847938a8",
  "./bootstrap.min.js?v=6f738f51e5a83b0e",
  "./app.min.js?v=d5bf2bbdf8388298",
]);
const VENDOR_ASSETS = Object.freeze([
  "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.css",
  "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js",
]);
const SHELL_REVISION = SHELL_ASSETS
  .map(asset => new URL(asset, self.location.href).searchParams.get("v"))
  .join("-");
const SHELL_CACHE = `${CACHE_VERSION}-shell-${SHELL_REVISION}`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const VENDOR_CACHE = `${CACHE_VERSION}-vendor`;
const TILE_CACHE = `${CACHE_VERSION}-tiles`;
const CURRENT_CACHES = new Set([SHELL_CACHE, DATA_CACHE, VENDOR_CACHE, TILE_CACHE]);
const ASSET_MANIFEST_URL = new URL("./extracted/asset-manifest.json", self.location.href).href;
const INDEX_URL = new URL("./index.html", self.location.href).href;
const SHELL_ASSET_URLS = new Set(SHELL_ASSETS.map(asset => new URL(asset, self.location.href).href));
const CORE_DATA_KEYS = Object.freeze(["route", "reference", "landmarks", "historicLandmarks"]);
const VENDOR_CACHE_LIMIT = 12;
const TILE_CACHE_LIMIT = 300;

const cacheableResponse = response => response.ok || response.type === "opaque";

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map(key => cache.delete(key)));
}

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (cacheableResponse(response)) {
    await cache.put(request, response.clone());
    if (limit) await trimCache(cacheName, limit);
  }
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (cacheableResponse(response)) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function precacheCoreData(shellCache) {
  const response = await shellCache.match(ASSET_MANIFEST_URL);
  const manifest = await response.json();
  const assets = CORE_DATA_KEYS.map(key => manifest[key]);
  if (assets.some(asset => typeof asset !== "string")) {
    throw new Error("Asset manifest is missing core data URLs");
  }
  await caches.open(DATA_CACHE).then(cache => cache.addAll(assets));
}

self.addEventListener("install", event => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE)
        .then(async cache => {
          await cache.addAll(["./index.html", "./extracted/asset-manifest.json", ...SHELL_ASSETS]);
          await precacheCoreData(cache);
        }),
      caches.open(VENDOR_CACHE)
        .then(cache => Promise.all(VENDOR_ASSETS.map(asset => cache.add(asset).catch(() => undefined)))),
    ])
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && !CURRENT_CACHES.has(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const scopePath = new URL(self.registration.scope).pathname;
  const isAppShell = url.origin === location.origin
    && (url.pathname === scopePath || url.pathname === `${scopePath}index.html`);

  if (request.mode === "navigate") {
    event.respondWith(
      isAppShell
        ? networkFirst(request, SHELL_CACHE).catch(() => caches.match(INDEX_URL))
        : fetch(request)
    );
    return;
  }

  if (request.url === ASSET_MANIFEST_URL) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  if (url.origin === location.origin && /\.(?:geojson|json)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, DATA_CACHE, 32));
    return;
  }

  if (SHELL_ASSET_URLS.has(request.url)) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  if (url.origin === location.origin && /\.(?:css|js)$/i.test(url.pathname)) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  if (url.hostname === "unpkg.com") {
    event.respondWith(cacheFirst(request, VENDOR_CACHE, VENDOR_CACHE_LIMIT));
    return;
  }

  if (
    url.hostname.endsWith("arcgisonline.com")
    || url.hostname.endsWith("arcgis.com")
    || url.hostname === "historical1.arcgis.com"
    || url.hostname === "s3.amazonaws.com"
    || url.hostname === "fonts.openmaptiles.org"
  ) {
    event.respondWith(cacheFirst(request, TILE_CACHE, TILE_CACHE_LIMIT));
  }
});

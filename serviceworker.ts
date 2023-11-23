const cacheName = "emoteJAM-v1";
const assets = [
    'index.html',
    'css/bright.css',
    'css/main.css',
    'css/reset.css',
    'gif.js',
    'gif.worker.js',
    'img/tsodinClown.png',
    'js/eval.js',
    'js/filters.js',
    'js/grecha.js',
    'js/index.js',
];

self.addEventListener("install", e => {
    console.log("[Service Worker] Install");
    const event = e as ExtendableEvent;
    event.waitUntil((async () => {
        console.log("[Service Worker] Caching all the assets");
        const cache = await caches.open(cacheName);
        cache.addAll(assets);
    })());
});

self.addEventListener("activate", e => {
    console.log("[Service Worker] Activate");
    const event = e as ExtendableEvent;
    event.waitUntil((async() => {
        console.log("[Service Worker] Cleaning up all caches");
        const keys = await caches.keys();
        for (let key in keys) {
            if (key !== cacheName) {
                await caches.delete(key);
            }
        }
    })());
});

self.addEventListener("fetch", (e) => {
    const event = e as FetchEvent;
    event.respondWith((async () => {
        console.log(`[Service Worker] Fetch ${event.request.url}`);
        const cache = await caches.open(cacheName);
        let response = await cache.match(event.request.url);
        if (response === undefined) {
            console.log(`[Service Worker] Response for ${event.request.url} is not available in cache. Making an actual request...`);
            response = await fetch(event.request.url);
            cache.put(event.request.url, response.clone());
        }
        return response;
    })());
});

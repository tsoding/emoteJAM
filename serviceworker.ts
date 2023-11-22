const assets = [
    '/index.html',
    '/css/bright.css',
    '/css/main.css',
    '/css/reset.css',
    '/gif.js',
    '/gif.worker.js',
    '/img/tsodinClown.png',
    '/js/eval.js',
    '/js/filters.js',
    '/js/grecha.js',
    '/js/index.js',
];

self.addEventListener("install", e => {
    const event = e as ExtendableEvent;
    event.waitUntil((async () => {
        for (let asset of assets) {
            const cache = await caches.open("v1");
            console.log(`Caching ${asset}...`);
            const response = await fetch(asset);
            cache.put(asset, response.clone());
        }
    })());
});

self.addEventListener("fetch", (e) => {
    const event = e as FetchEvent;
    if (!navigator.onLine) {
        event.respondWith(caches.match(event.request.url).then((response) => {
            if (response !== undefined) {
                return response;
            }
            const headers = new Headers();
            headers.append("Content-Type", "text/html");
            // TODO: better 404 for service worker
            return new Response("<h1>You are offline! LoooooLL!!11 4HEad</h1>", {
                status: 200,
                headers: headers
            });
        }));
    } else {
        event.respondWith((async () => {
            const response = await fetch(event.request);
            const cache = await caches.open("v1");
            cache.put(event.request.url, response.clone());
            return response;
        })());
    }
});

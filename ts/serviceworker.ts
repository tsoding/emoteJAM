
self.addEventListener("install", (event) => {
    console.log("Pog! Looks like we installed something! I have no idea what that means, but here is an object the browser sent us", event);
});

self.addEventListener("fetch", (e) => {
    const event = e as FetchEvent;
    if (!navigator.onLine) {
        console.log("We are offline! Serving request from the cache.");
        event.respondWith(caches.match(event.request).then((response) => {
            if (response !== undefined) {
                return response;
            }
            const headers = new Headers();
            headers.append("Content-Type", "text/html");
            return new Response("<h1>You are offline! LoooooLL!!11 4HEad</h1>", {
                status: 200,
                headers: headers
            });
        }));
    } else {
        console.log("We are online! Forwarding the request.");
        event.respondWith((async () => {
            const response = await fetch(event.request);
            const cache = await caches.open("v1");
            cache.put(event.request, response.clone());
            return response;
        })());
    }
});


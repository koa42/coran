const CACHE_NAME = "mon-coran-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./logo.png"
];


/* Installation */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(FILES_TO_CACHE);

      })

  );

  self.skipWaiting();

});


/* Activation */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))

        );

      })

  );

  self.clients.claim();

});


/* Interception des requêtes */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {

          return cachedResponse;

        }


        return fetch(event.request)
          .then(response => {

            return response;

          })
          .catch(() => {

            return caches.match("./index.html");

          });

      })

  );

});
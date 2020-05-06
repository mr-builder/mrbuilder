import {registerRoute} from 'workbox-routing';
import {precacheAndRoute} from 'workbox-precaching';
import {NetworkFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    /https:\/\/api\.exchangeratesapi\.io\/latest/,
    new NetworkFirst({
        cacheName: "currencies",
        plugins: [
            new ExpirationPlugin({
                // Only cache requests for a minute
                maxAgeSeconds: 10 * 60,
                // Only cache 10 requests.
                maxEntries: 10,
            }),
        ]
    })
);

addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        skipWaiting();
    }
});

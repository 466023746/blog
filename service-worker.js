self.importScripts('./node_modules/sw-toolbox/sw-toolbox.js');

self.toolbox.precache([
    '/images/touch/icon-48.png',
    '/images/touch/icon-72.png',
    '/images/touch/icon-96.png',
    '/images/touch/icon-144.png',
    '/images/touch/icon-168.png',
    '/images/touch/icon-192.png',
]);
self.toolbox.router.get('/*', toolbox.networkFirst);

self.importScripts('/js/sw-toolbox.js');

self.toolbox.router.get(/.*/, (...args) => {
    const [request, values, options] = args;
    const {url} = request;

    // if (/\.md$/.test(url)) {
    //     return toolbox.cacheFirst(...args);
    // } else {
        return toolbox.networkFirst(...args);
    // }
});

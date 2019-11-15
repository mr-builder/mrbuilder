let count = 1;
setInterval(() => {
    self.postMessage({ count: count++ });
    console.log('sent count', count);
}, 2000);

// Respond to message from parent thread
self.addEventListener('message', (event) => {
    count = 1;
    self.postMessage({ count });
    console.log('reset count', event);
});

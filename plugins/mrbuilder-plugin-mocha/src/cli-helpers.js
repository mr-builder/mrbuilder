//This file is used to pollyfill things for non browser testing.
require('raf/polyfill');
const {JSDOM} = require('jsdom');

const jsdom    = new JSDOM('<!doctype html><html><body></body></html>');
const {window} = jsdom;

const copyProps = (src, target) => Object.defineProperties(target,
    Object.getOwnPropertyNames(src)
        .filter(prop => prop === 'GLOBAL' || prop === 'root' || typeof target[prop] === 'undefined')
        .reduce((result, prop) => Object.assign(result, {
            [prop]: Object.getOwnPropertyDescriptor(src, prop),
        }), {}));

copyProps(global, window);
global.window    = window;
global.document  = window.document;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);

#!/usr/bin/env node
const rimraf = require('rimraf');
if (process.argv.length === 2) {
    process.argv.push('./lib');
}
const parts  = process.argv.slice(2).filter(v => !/^--/.test(v));
const remove = () => {
    if (parts.length) {
        const cur = parts.shift();
        rimraf(cur, remove);
        console.log('removed', cur);

    } else {
        process.exit(0);
    }
};
remove();

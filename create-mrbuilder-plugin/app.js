#!/usr/bin/env node
process.argv.splice(2, 0, '--plopfile', `${__dirname}/plopfile.js`);
const idx = process.argv.findIndex(v => v === '-h' || v === '--help', 4);
if (idx > -1){
    process.argv.splice(idx, 1, '--', '--help');
}
require('plop/bin/plop');


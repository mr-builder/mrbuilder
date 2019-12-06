#!/usr/bin/env node
const tmp = require('tmp');
const fs = require('fs');

process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-babel-7`;
const om = require('@mrbuilder/cli').default;

const {argv} = process;

let useConfig = true;

if (!argv.includes('-s')) {
    argv.push('-s', 'true');
}
if (!(argv.includes('--out-file') || argv.includes('--out-dir'))) {
    argv.push('--out-dir', 'lib');
}
if (!(argv.includes('--copy-files') || argv.includes('-D'))) {
    argv.push('--copy-files');
}
if (argv.includes('--presets')) {
    useConfig = false;
}
if (argv.includes('--plugins')) {
    useConfig = false
}
if (!(argv.includes('--out-file') || argv.includes('--filename'))) {
    argv.push('src');
}
if (argv.includes('--config-file')) {
    useConfig = false;
}
let tmpobj = tmp.fileSync();
if (useConfig) {
    fs.writeFileSync(tmpobj.name, JSON.stringify(require(`../babel-config`), null, 2), 'utf8');
    argv.push('--config-file', tmpobj.name);
}
require('@babel/cli/bin/babel');

#!/usr/bin/env node
const tmp = require('tmp');
const fs  = require('fs');
const version = require('../version');

let om = global._MRBUILDER_OPTIONS_MANAGER;
if (!om) {
    process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},mrbuilder-plugin-babel`;

    om = global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)
}

const {argv}  = process;

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
    fs.writeFileSync(tmpobj.name, JSON.stringify(require(`mrbuilder-plugin-babel-${version}/babel-config`), null, 2), 'utf8');
    argv.push('--config-file', tmpobj.name);
}
switch (version + '') {
    case '7':
        require('@babel/cli/bin/babel');
        break;
    default:
        require('babel-cli/bin/babel');
}

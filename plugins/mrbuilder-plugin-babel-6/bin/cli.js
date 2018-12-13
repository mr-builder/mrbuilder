#!/usr/bin/env node
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PLUGINS=`${process.env.MRBUILDER_INTERNAL_PLUGINS ||''},mrbuilder-plugin-babel`;
    global._MRBUILDER_OPTIONS_MANAGER =
        new (require('mrbuilder-optionsmanager').default)
}
const { plugins, presets }        = require(
    'mrbuilder-plugin-babel/babel-config');
const { argv }                    = process;
if (!argv.includes('-s')) {
    argv.push('-s', 'true');
}
if (!(argv.includes('--out-file') || argv.includes('--out-dir'))) {
    argv.push('--out-dir', 'lib');
}
if (!(argv.includes('--copy-files') || argv.includes('-D'))) {
    argv.push('--copy-files');
}
if (!argv.includes('--presets')) {
    argv.push('--presets', presets);
}
if (!argv.includes('--plugins')) {
    argv.push('--plugins', plugins);
}
if (!(argv.includes('--out-file') || argv.includes('--filename'))) {
    argv.push('src');
}
require('@babel/cli/bin/babel');

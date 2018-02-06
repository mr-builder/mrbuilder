#!/usr/bin/env -S MRBUILDER_INTERNAL_PRESETS=${MRBUILDER_INTERNAL_PRESETS},mrbuilder-preset-app node
const { argv }            = process;
if (!(argv.includes('--demo',2) || argv.includes('--app', 2))) {
    argv.push('--demo', 'demo');
}
require('./mrbuilder-webpack');

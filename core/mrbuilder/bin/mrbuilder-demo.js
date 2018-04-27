#!/usr/bin/env node
if (require('in-publish').inInstall()) {
    process.exit(0);
}

const { env } = process;
if (!('MRBUILDER_INTERNAL_PRESETS' in env)) {
    env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-app';
}

require('./mrbuilder-webpack');

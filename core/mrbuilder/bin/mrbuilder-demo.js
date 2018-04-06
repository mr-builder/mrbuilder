#!/usr/bin/env node
const { env } = process;
if (!('MRBUILDER_INTERNAL_PRESETS' in env)) {
    env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-app';
}

require('./mrbuilder-webpack');

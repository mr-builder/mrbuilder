#!/usr/bin/env node
const { argv, env } = process;

env.MRBUILDER_INTERNAL_PRESETS =
    `${env.MRBUILDER_INTERNAL_PRESETS || ''},mrbuilder-preset-app`;

if (!(argv.includes('--demo', 2) || argv.includes('--app', 2))) {
    argv.push('--demo', 'demo');
}
require('./mrbuilder-webpack');

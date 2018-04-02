#!/usr/bin/env node
const { env } = process;
if (!('MRBUILDER_INTERNAL_PRESETS' in env)) {
    env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-lib';
}

if (!env.NODE_ENV) {
    env.NODE_ENV = 'test';
}
global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER =
    new (require('mrbuilder-optionsmanager'))(
        { prefix: 'mrbuilder', _require: require }));

require('mrbuilder-plugin-webpack-dev-server/bin/cli');

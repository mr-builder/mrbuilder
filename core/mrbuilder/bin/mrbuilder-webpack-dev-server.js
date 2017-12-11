#!/usr/bin/env node
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
process.env.MRBUILDER_INTERNAL_PRESETS = [process.env.MRBUILDER_INTERNAL_PRESETS, 'mrbuilder'].join(',');

console.log(require.resolve('mrbuilder/package.json'));
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });

require('mrbuilder-plugin-webpack-dev-server/bin/mrbuilder-webpack-dev-server');

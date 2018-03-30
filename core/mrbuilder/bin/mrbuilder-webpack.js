#!/usr/bin/env node
const { env }                  = process;
env.MRBUILDER_INTERNAL_PLUGINS =
    `${env.MRBUILDER_INTERNAL_PLUGINS || ''},mrbuilder-plugin-browserslist,mrbuilder-plugin-webpack`;

console.log('env.MRBUILDER_INTERNAL_PLUGINS',env.MRBUILDER_INTERNAL_PLUGINS)
if (!(env.NODE_ENV || env.MRBUILDER_ENV)) {
    env.MRBUILDER_ENV = env.NODE_ENV = 'production';
}

global._MRBUILDER_OPTIONS_MANAGER = new (require(
    'mrbuilder-optionsmanager'))(
    { prefix: 'mrbuilder', _require: require });

require('mrbuilder-plugin-webpack/bin/cli');

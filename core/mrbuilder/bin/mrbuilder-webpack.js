#!/usr/bin/env node
const { env }                  = process;
env.MRBUILDER_INTERNAL_PRESETS =
    `${env.MRBUILDER_INTERNAL_PRESETS || ''},mrbuilder`;

if (!(env.NODE_ENV || env.MRBUILDER_NODE_ENV)) {
    env.NODE_ENV = 'production';
}

global._MRBUILDER_OPTIONS_MANAGER =
    global._MRBUILDER_OPTIONS_MANAGER || new (require(
    'mrbuilder-optionsmanager'))(
    { prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack/bin/cli');

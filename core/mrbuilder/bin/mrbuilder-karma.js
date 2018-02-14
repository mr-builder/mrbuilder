#!/usr/bin/env node
const { env }                  = process;
env.MRBUILDER_INTERNAL_PRESETS =
    `${env.MRBUILDER_INTERNAL_PRESETS || ''},mrbuilder`;
if (env.NODE_ENV) {
    env.NODE_ENV = 'test';
}
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager'))(
    { prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-karma/bin/cli');

#!/usr/bin/env node
const { env } = process;

env.MRBUILDER_INTERNAL_PLUGINS =
    `${env.MRBUILDER_INTERNAL_PLUGINS || ''},mrbuilder-plugin-babel,mrbuilder-plugin-enzyme,mrbuilder-plugin-mocha`;

if (!env.NODE_ENV) {
    env.NODE_ENV = 'test';
}
if (!env.MRBUILDER_ENV) {
    env.MRBUILDER_ENV = env.NODE_ENV;
}
global._MRBUILDER_OPTIONS_MANAGER =
    global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER =
                                          new (require('mrbuilder-optionsmanager'))(
                                              { prefix: 'mrbuilder', _require: require }));
if (!env.MRBUILDER_AUTO_INSTALLING) {
  require('mrbuilder-plugin-mocha/bin/cli');
}

#!/usr/bin/env node
const { env } = process;

env.MRBUILDER_INTERNAL_PLUGINS =
    `${env.MRBUILDER_INTERNAL_PLUGINS || ''},mrbuilder-plugin-babel`;

if (!env.NODE_ENV) {
    env.NODE_ENV = 'production';
}
if (!env.MRBUILDER_ENV) {
    env.MRBUILDER_ENV = env.NODE_ENV;
}
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager'))({
    prefix  : 'mrbuilder',
    _require: require
});
if (!env.MRBUILDER_AUTO_INSTALLING) {
    require('mrbuilder-plugin-babel/bin/babel-cli');
}

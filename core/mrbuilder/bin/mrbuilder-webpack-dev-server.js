#!/usr/bin/env node
if (require('in-publish').inInstall()) {
    process.exit(0);
}

const { env, argv } = process;
if (!('MRBUILDER_INTERNAL_PRESETS' in env)) {
    //make webpack-dev-server has same behaviour as webpack.
    if (argv.slice(2).find(v => /--(app|demo)(=.*)?$/.test(v))) {
        env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-app';
    } else {
        env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-lib';
    }
}
if (!('MRBUILDER_INTERNAL_PLUGINS' in env)) {
    env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-plugin-webpack-dev-server';
}


if (!env.NODE_ENV) {
    env.NODE_ENV = 'development';
}

if (!env.MRBUILDER_ENV) {
    env.MRBUILDER_ENV = env.NODE_ENV;
}

global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER =
    new (require('mrbuilder-optionsmanager'))(
        { prefix: 'mrbuilder', _require: require }));

if (!env.MRBUILDER_AUTO_INSTALLING) {
    require('mrbuilder-plugin-webpack-dev-server/bin/cli');
}

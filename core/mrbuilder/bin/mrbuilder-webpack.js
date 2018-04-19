#!/usr/bin/env node
const { env, argv } = process;
//This allows someone to define internal presets to empty
// to prevent any presets to be used.
if (!('MRBUILDER_INTERNAL_PRESETS' in env)) {

    if (argv.slice(2).find(v => /--(app|demo)(=.*)?$/.test(v))) {
        env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-app';
    } else {
        env.MRBUILDER_INTERNAL_PRESETS = 'mrbuilder-preset-lib';
    }
}

if (!('MRBUILDER_INTERNAL_PLUGINS' in env)) {
    env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-plugin-webpack';
}

if (!(env.NODE_ENV || env.MRBUILDER_ENV)) {
    env.MRBUILDER_ENV = env.NODE_ENV = 'production';
}

global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager'))(
    { prefix: 'mrbuilder', _require: require });

//Funny story, so we can do auto install with yarn... but it will run webpack
// after every step.  This takes forever is borken.   So we set this ENV when
// we run yarn as an install.   Otherwise it should have normal install
// semantics.
if (!env.MRBUILDER_AUTO_INSTALLING) {
    require('mrbuilder-plugin-webpack/bin/cli');
}

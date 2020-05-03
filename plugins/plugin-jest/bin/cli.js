#!/usr/bin/env node
const {env, argv} = process;
env.NODE_ENV = env.NODE_ENV || 'test';
env.MRBUILDER_ENV = 'jest';
env.MRBUILDER_INTERNAL_PRESETS = `${env.MRBUILDER_INTERNAL_PRESETS || ''},@mrbuilder/cli`;

const {optionsManager} = require('@mrbuilder/cli');
const tryRequire = (src) => {
    try {
        require.resolve(optionsManager.cwd(src));
        return true;
    } catch (e) {
        //caught
    }
    return false;
}

if (argv.includes('-c', 2)
    || argv.includes('--config', 2)
    || argv.find(v => v.startsWith('--config='), 2)
    || tryRequire('jest.config')
    || require(optionsManager.cwd('package.json')).jest
) {
    return require('jest/bin/jest');
}

//use mrbuilders
argv.splice(2, 0, '--config', optionsManager.require.resolve('@mrbuilder/plugin-jest/jest.config'));
optionsManager.enabled('@mrbuilder/plugin-webpack') ?
    require('@mrbuilder/plugin-webpack/webpack.config').then(conf => {
        global._MRBUILDER_WEBPACK = conf;
        return require('jest/bin/jest');
    }) : require('jest/bin/jest');


#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PRESETS = `${process.env.MRBUILDER_INTERNAL_PRESETS || ''},@mrbuilder/preset-lib,@mrbuilder/preset-test`;
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;

const om = require('@mrbuilder/cli').default;

const fs = require('fs');
if (!(fs.existsSync(om.cwd('jest.config.js')) || require(om.cwd('package.json')).jest)) {
    const argv = process.argv;
    if (!(argv.includes('--config', 2) || argv.includes('-c', 2))) {
        argv.splice(2, 0, '--config', om.require.resolve('@mrbuilder/plugin-jest/src/jest.config.js'));
    }
}
if (om.enabled('@mrbuilder/plugin-webpack')) {
    require('@mrbuilder/plugin-webpack/webpack.config').then(conf => {
        global._MRBUILDER_WEBPACK = conf;
        return require('jest/bin/jest');
    })
} else {
    return require('jest/bin/jest');
}

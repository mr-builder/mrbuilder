#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS},@mrbuilder/plugin-webpack`;

const optionsManager = require('@mrbuilder/cli').default;

const {join} = require('path');
if (process.argv.includes('--help', 2) || process.argv.includes('-h')) {
    console.warn(optionsManager.help());
}

if (!process.argv.includes('--config', 2)) {
    const config = join(__dirname, '..', 'webpack.config.js');
    optionsManager.info('using', config);
    process.argv.push('--config', config)
}
require('webpack-cli/bin/cli');

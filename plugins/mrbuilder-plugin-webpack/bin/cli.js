#!/usr/bin/env node
const OptionsManager = require('mrbuilder-optionsmanager');
const optionsManager = global._MRBUILDER_OPTIONS_MANAGER ||
                       (global._MRBUILDER_OPTIONS_MANAGER = new OptionsManager({
                           prefix  : 'mrbuilder',
                           _require: require
                       }));
const { join }       = require('path');
if (process.argv.includes('--help', 2) || process.argv.includes('-h')) {
    console.warn(optionsManager.help());
}

if (!process.argv.includes('--config', 2)) {
    const config = join(__dirname, '..', 'webpack.config.js');
    optionsManager.info('using', config);
    process.argv.push('--config', config)
}
require('webpack/bin/webpack');

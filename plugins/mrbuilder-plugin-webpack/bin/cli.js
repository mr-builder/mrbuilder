#!/usr/bin/env node

if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PLUGINS =
        `${  process.env.MRBUILDER_INTERNAL_PLUGINS},mrbuilder-plugin-webpack`;
    global._MRBUILDER_OPTIONS_MANAGER      = new (require('mrbuilder-optionsmanager').default)({
        prefix  : 'mrbuilder',
        _require: require
    });
}

const optionsManager = global._MRBUILDER_OPTIONS_MANAGER;
const { join } = require('path');
if (process.argv.includes('--help', 2) || process.argv.includes('-h')) {
    console.warn(optionsManager.help());
}

if (!process.argv.includes('--config', 2)) {
    const config = join(__dirname, '..', 'webpack.config.js');
    optionsManager.info('using', config);
    process.argv.push('--config', config)
}
require('webpack-cli/bin/webpack');

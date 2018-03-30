#!/usr/bin/env node
const env = process.env;
if (!env.NODE_ENV) {
    env.NODE_ENV = 'development';
}
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    env.MRBUILDER_INTERNAL_PLUGINS =
        `${env.MRBUILDER_INTERNAL_PLUGINS},mrbuilder-webpack,mrbuilder-webpack-dev-server`;

    global._MRBUILDER_OPTIONS_MANAGER =
        new (require('mrbuilder-optionsmanager').default)({
            prefix  : 'mrbuilder',
            _require: require
        });
}

const optionsManager = global._MRBUILDER_OPTIONS_MANAGER;

const devServer = require.resolve('webpack-dev-server/bin/webpack-dev-server');

if (!process.argv.includes('--config', 2)) {
    process.argv.push('--config',
        require.resolve('mrbuilder-plugin-webpack/webpack.config'));
}

optionsManager.debug(devServer, process.argv.slice(2));

require(devServer);

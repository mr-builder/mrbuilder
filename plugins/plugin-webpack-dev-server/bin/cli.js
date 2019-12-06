#!/usr/bin/env node
const env = process.env;
if (!env.NODE_ENV) {
    env.NODE_ENV = 'development';
}
const optionsManager = require('@mrbuilder/cli').default;

const devServer = require.resolve('webpack-dev-server/bin/webpack-dev-server');

if (!process.argv.includes('--config', 2)) {
    process.argv.push('--config', require.resolve('@mrbuilder/plugin-webpack/webpack.config'));
}

optionsManager.debug(devServer, process.argv.slice(2));

try {
    require(devServer);
} catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        console.warn(`wrong version of webpack trying to locate correct version`, devServer);
        return require('@mrbuilder/plugin-webpack-dev-server/node_modules/webpack-dev-server/bin/webpack-dev-server')
    }
    throw e
}

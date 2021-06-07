#!/usr/bin/env node
const env = process.env;
if (!env.NODE_ENV) {
    env.NODE_ENV = 'development';
}
const optionsManager = require('@mrbuilder/cli').default;


const tryResolve = (...locations) => {
    for (const c of locations) {
        try {
            return require.resolve(c);
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
    }
    throw new Error(`Could not resolve in :${locations}`);
}

const devServer = tryResolve(
    '@webpack-cli/serve',
    'webpack-cli/bin/cli',
    'node_modules/.bin/webpack',
    '@mrbuilder/plugin-webpack/node_modules/webpack-cli/bin/cli'
);

if (!process.argv.includes('serve', 2)) {
    process.argv.splice(2, 0, 'serve');
}
if (!process.argv.includes('--config', 2)) {
    process.argv.push('--config', require.resolve('@mrbuilder/plugin-webpack/webpack.config'));
}

optionsManager.debug(devServer, process.argv.slice(2));
require(devServer);

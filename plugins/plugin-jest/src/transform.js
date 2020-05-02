const babelJest = require('babel-jest');
const {optionsManager} = require('@mrbuilder/cli');

const babelConfig = require('@mrbuilder/plugin-babel/babel-config');
const webpackPoly = require('./webpackRequireContext');

const transform = babelJest.createTransformer(babelConfig);

module.exports = optionsManager.enabled('@mrbuilder/plugin-webpack') ? {
    ...transform,
    process(src, filename, config, transformOptions) {
        return transform.process.call(this, webpackPoly.process(src, filename), filename, config, transformOptions);
    }
} : transform;
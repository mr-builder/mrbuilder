const babelJest = require('babel-jest');

const babelConfig = require('@mrbuilder/plugin-babel/babel-config');
const webpackPoly = require('./webpackRequireContext');

const transform = babelJest.createTransformer(babelConfig);

module.exports = {
    ...transform,
    process(src, filename, config, transformOptions) {
        if (global._MRBUILDER_OPTIONS_MANAGER.enabled('@mrbuilder/plugin-webpack')) {
            src = webpackPoly.process(src, filename);
        }
        return transform.process.call(this, src, filename, config, transformOptions);
    }
};
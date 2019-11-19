const babelJest = require('babel-jest');

const babelConfig = require('@mrbuilder/plugin-babel/babel-config');


const transform = babelJest.createTransformer(babelConfig);

module.exports = transform;
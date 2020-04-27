const {cssLoaderModule} = require(
    '@mrbuilder/plugin-css/src/cssLoader');
const {enhancedResolve: _resolve} = require('@mrbuilder/utils');

const TRUE_RE = /[.](?:s[ac]ssm)$/;
module.exports = function ({
                               test,
                               options = {},
                               modules,
                               loader = 'sass-loader',
                           }, webpack, om) {

    if (options.includePaths) {
        options.includePaths = options.includePaths.map(v => _resolve(v, om));
    }
    cssLoaderModule(webpack, modules === true ? TRUE_RE : modules, test, om, {
        loader,
        options
    });


    return webpack;
};

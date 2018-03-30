const cssLoader                     = require(
    'mrbuilder-plugin-css/src/cssLoader');
const { enhancedResolve: _resolve } = require('mrbuilder-utils');

module.exports = function ({
                               test = /\.s[ac]ss$/,
                               options,
                               modules = true,
                           }, webpack, om) {

    if (options == null) {
        options = {
            sourceMaps: true,
        }
    }

    if (options.includePaths) {
        options.includePaths = options.includePaths.map(_resolve);
    }

    cssLoader(webpack, test, true, {
        loader: 'sass-loader',
        options
    });

    if (modules) {
        cssLoader(webpack, modules === true ? /\.s[ac]ssm$/ : modules, true, om,
            {
                loader: 'sass-loader',
                options
            })
    }

    return webpack;
};

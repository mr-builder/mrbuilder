const cssLoader                     = require(
    'mrbuilder-plugin-css/src/cssLoader');
const { enhancedResolve: _resolve } = require('mrbuilder-utils');

module.exports = function ({
                               test = /\.sass$/,
                               options,
                               modules = true,
                           }, webpack) {

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
        cssLoader(webpack, modules === true ? /\.sassm/ : modules, true, {
            loader: 'sass-loader',
            options
        })
    }

    return webpack;
};

const cssLoader = require('mrbuilder-plugin-css/src/cssLoader');


const { cwd, enhancedResolve: _resolve } = require('mrbuilder-utils');

module.exports = function ({
                               alias,
                               sourceMap = true,
                               modules = true,
                               paths = [
                                   cwd('node_modules'),
                                   cwd('../node_modules'),
                               ],
                               nib = true,
                               includeCss = true,
                               hoistAtRules = true,
                               compress = false,
                               preferPathResolver,
                               localIdentName = '[package-name]_[hyphen:base-name]_[local]'
                           }, webpack, om) {

    paths = paths.map((v) => _resolve(v));

    const stylusOptions = {
        loader : 'stylus-loader',
        options: {
            preferPathResolver,
            sourceMap,
            paths,
            compress

        },
    };
    if (alias) {
        Object.keys(alias).forEach(function (key) {
            this[key] = _resolve(alias[key]);
        }, webpack.resolve.alias || (webpack.resolve.alias = {}));
    }
    if (includeCss !== null) {
        stylusOptions.options['include css'] = includeCss;
    }

    if (hoistAtRules !== null) {
        stylusOptions.options['hoist atrules'] = hoistAtRules;
    }

    if (nib) {
        stylusOptions.options.use    = [require('nib')()];
        stylusOptions.options.import = ['~nib/lib/nib/index.styl'];
    }


    cssLoader(webpack, /\.styl$/, false, stylusOptions);

    if (modules) {
        cssLoader(webpack, modules === true ? /\.stylm$/ : modules,
            true, stylusOptions);
    }

    return webpack;
};

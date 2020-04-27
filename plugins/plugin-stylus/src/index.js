const {cssLoaderModule} = require('@mrbuilder/plugin-css');


const {cwd, enhancedResolve: _resolve} = require('@mrbuilder/utils');

module.exports = function ({
                               alias,
                               test,
                               sourceMap,
                               modules,
                               paths = [
                                   cwd('node_modules'),
                                   cwd('../node_modules'),
                               ],
                               nib,
                               includeCss,
                               hoistAtRules,
                               compress,
                               preferPathResolver,
                           }, webpack, om) {

    paths = paths.map((v) => _resolve(v, om.resolve));

    const stylusOptions = {
        loader: 'stylus-loader',
        options: {
            preferPathResolver,
            sourceMap,
            paths,
            compress

        },
    };
    if (alias) {
        Object.keys(alias).forEach(function (key) {
            this[key] = _resolve(alias[key], om.require);
        }, webpack.resolve.alias || (webpack.resolve.alias = {}));
    }
    if (includeCss !== null) {
        stylusOptions.options['include css'] = includeCss;
    }

    if (hoistAtRules !== null) {
        stylusOptions.options['hoist atrules'] = hoistAtRules;
    }

    if (nib) {
        stylusOptions.options.use = [require('nib')()];
        stylusOptions.options.import = ['~nib/lib/nib/index.styl'];
    }

    return cssLoaderModule(webpack, modules, test, om, stylusOptions);
};

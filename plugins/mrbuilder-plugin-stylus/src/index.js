const path = require('path');

const { cwd, enhancedResolve:_resolve }  = require('mrbuilder-utils');

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
                               getLocalIdent = require('./getLocalIdent'),
                               stylusContext = 'src',
                               localIdentName = '[package-name]_[hyphen:base-name]_[local]'
                           }, webpack, om) {

    paths = paths.map(_resolve);

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
    if (typeof getLocalIdent === 'string') {
        getLocalIdent = require(_resolve(getLocalIdent));
    }

    webpack.module.rules.unshift({
        test: /\.styl$/,
        use : this.useStyle(
            {
                loader : 'css-loader',
                options: {
                    sourceMap
                }
            }, stylusOptions)
    });
    if (modules) {
        webpack.module.rules.unshift({
            test: /\.stylm$/,
            use : this.useStyle({
                loader : 'css-loader',
                options: {
                    sourceMap     : true,
                    modules       : true,
                    camelCase     : false,
                    localIdentName: localIdentName,
                    context       : stylusContext || 'src',
                    getLocalIdent,

                }
            }, stylusOptions)
        });

    }

    return webpack;
};

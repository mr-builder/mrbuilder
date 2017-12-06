const path          = require('path');
const getLocalIdent = require('./getLocalIdent');

module.exports = function ({
                               alias,
                               sourceMap = true,
                               modules = true,
                               paths = [],
                               nib = true,
                               includeCss = true,
                               hoistAtRules = true,
                               compress = false,
                               preferPathResolver,
                               stylusContext = 'src',
                               localIdentName = '[package-name]_[hyphen:base-name]_[local]'
                           }, webpack) {

    const stylusOptions = {
        loader : 'stylus-loader',
        options: {
            preferPathResolver,
            sourceMap,
            paths,
            compress,
        },
    };
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

    if (path.relative(process.cwd(), __dirname) !== '') {
        stylusOptions.options.paths.unshift(
            path.join(process.cwd(), 'node_modules'));
    }
    webpack.module.rules.push({
        test: /\.styl$/,
        use : this.useStyle(
            {
                loader : 'css-loader',
                options: {
                    sourceMap,
                    alias
                }
            }, stylusOptions)
    });
    if (modules) {
        webpack.module.rules.push({
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
                    alias
                }
            }, stylusOptions)
        });
    }

    return webpack;

};

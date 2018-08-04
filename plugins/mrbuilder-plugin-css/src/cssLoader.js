if (!global._MRBUILDER_OPTIONS_MANAGER) {
    throw new Error('_MRBUILDER_OPTIONS_MANAGER not set');
}

const useStyle      = require('./styleLoader');
const getLocalIdent = require('./getLocalIdent');

module.exports = function (webpack, test, modules = false, om, ...conf) {

    const mrb = (v, d) => om.config('mrbuilder-plugin-css' + (v ? `.${v}` : ''), d);

    const loaders = [{
        loader : 'css-loader',
        options: modules ? {
            sourceMap     : mrb('sourceMap', true),
            modules       : true,
            camelCase     : mrb('camelCase', true),
            localIdentName: mrb('localIdentName', '[hash]_[package-name]_[hyphen:base-name]_[local]'),
            context       : mrb('context', 'src'),
            getLocalIdent,
        } : {
            sourceMap: mrb('sourceMap', true),
            modules  : false,
            context  : mrb('context', 'src')
        }
    }];
    if (mrb('autoprefixer')) {
        loaders.push({
            loader : 'postcss-loader',
            options: {
                plugins: [
                    require('autoprefixer')()
                ]
            }
        });
    }
    if (conf) {
        loaders.push(...conf);
    }
    webpack.module.rules.push({
        test,
        use: useStyle(webpack, ...loaders)
    });
}

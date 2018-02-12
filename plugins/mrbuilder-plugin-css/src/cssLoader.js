if (!global._MRBUILDER_OPTIONS_MANAGER) {
    throw new Error('_MRBUILDER_OPTIONS_MANAGER not set');
}
const om = global._MRBUILDER_OPTIONS_MANAGER;

const useStyle      = require('./styleLoader');
const getLocalIdent = require('./getLocalIdent');

const mrb = (v, d) => om.config('mrbuilder-plugin-css' + (v ? `.${v}` : ''), d);

module.exports = function (webpack, test, modules = false, ...conf) {

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
    if (mrb('autoloader')) {
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

const useStyle = require('./styleLoader');
const getLocalIdent = require('./getLocalIdent');

module.exports = function (webpack, test, modules = false, om, ...conf) {

    const mrb = (v, d) => om.config('@mrbuilder/plugin-css' + (v ? `.${v}` : ''), d);
    const localsConvention = mrb('localsConvention', mrb('camelCase', true) ? 'camelCase' : 'asIs');
    const loaders = [{
        loader: 'css-loader',
        options: modules ? {
            sourceMap: mrb('sourceMap', true),
            localsConvention,
            modules: modules ? {
                ...(typeof modules  === 'object' ? modules : {}),
                localIdentName: mrb('localIdentName', '[hash]_[package-name]_[hyphen:base-name]_[local]'),
                context: mrb('context', om.config('@mbuilder/cli.sourceDir', 'src')),
                getLocalIdent,
            } : false
        } : {
            sourceMap: mrb('sourceMap', true),
            localsConvention,
            modules: modules ? {
                ...(typeof modules  === 'object' ? modules : {}),
                context: mrb('context', om.config('@mbuilder/cli.sourceDir', 'src')),
            } : false,
        }
    }];
    if (mrb('autoprefixer')) {
        loaders.push({
            loader: 'postcss-loader',
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

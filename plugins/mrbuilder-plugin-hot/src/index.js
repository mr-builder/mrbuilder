const { NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack');

module.exports = ({
                      preEntry = ['react-hot-loader/patch'],
                      babel = require('mrbuilder-plugin-babel/babel-config'),
                      hot = true,
                      inline = true,
                  }, webpack) => {

    webpack.devtool = 'cheap-module-source-map';
    babel.plugins.unshift(require.resolve("react-hot-loader/babel"));
    const env = /\/babel-preset-env\/|^(env|es2015)$|\/babe-preset-es2015\//;
    const idx = babel.presets.findIndex(v => env.test(v));
    if (idx > -1) {
        let newMod       = babel.presets[idx];
        const [mod, conf = {}] = Array.isArray(newMod) ? newMod : [newMod];
        conf.modules     = false;
        babel.presets.splice(idx, 1, [mod, conf])
    } else {
        babel.presets.push(['babel-preset-env', { modules: false }])
    }
    if (!webpack.devServer) {
        webpack.devServer = {};
    }
    webpack.devServer.hot    = hot;
    webpack.devServer.inline = inline;

    webpack.entry =
        Object.keys(webpack.entry).reduce(function (ret, key) {
            ret[key] = preEntry.concat(webpack.entry[key]);
            return ret;
        }, {});
    webpack.plugins.push(new NamedModulesPlugin(),
        new HotModuleReplacementPlugin());

};

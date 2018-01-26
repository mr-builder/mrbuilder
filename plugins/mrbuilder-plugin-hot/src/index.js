const { NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack');

module.exports = ({
                      preEntry = ['react-hot-loader/patch'],
                      babel = require('mrbuilder-plugin-babel/babel-config'),
                      hot = true,
                      inline = true,
                  }, webpack) => {

    webpack.devtool = 'cheap-module-source-map';

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

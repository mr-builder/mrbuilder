const {NamedModulesPlugin, HotModuleReplacementPlugin} = require('webpack');

module.exports = function ({
                               preEntry = ['react-hot-loader/patch'],
                               hot = true,
                               inline = true,
                               devtool,
                           }, webpack) {

    webpack.devtool = devtool || 'cheap-module-source-map';
    if (!webpack.devServer) {
        webpack.devServer = {};
    }
    webpack.devServer.hot    = hot;
    webpack.devServer.inline = inline;
    webpack.plugins.push(new NamedModulesPlugin(),
        new HotModuleReplacementPlugin());

};

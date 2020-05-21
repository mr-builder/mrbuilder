const {HotModuleReplacementPlugin} = require('webpack');

module.exports = function ({
                               preEntry,
                               hot = true,
                               inline = true,
                               devtool,
                           }, webpack) {

    webpack.devtool = devtool || 'cheap-module-source-map';
    if (!webpack.devServer) {
        webpack.devServer = {};
    }
    webpack.devServer.hot = hot;
    webpack.devServer.inline = inline;
    if (!webpack.optimization) {
        webpack.optimization = {};
    }
    webpack.optimization.namedModules = true;
    webpack.plugins.push(new HotModuleReplacementPlugin());

};

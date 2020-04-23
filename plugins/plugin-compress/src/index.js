const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function (options, webpack) {
    if (!webpack.plugins) {
        webpack.plugins = [];
    }
    webpack.plugins.push(new CompressionPlugin(options));

    return webpack;
}
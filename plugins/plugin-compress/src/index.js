const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin')

module.exports = function (options, webpack, om) {
    if (!webpack.plugins) {
        webpack.plugins = [];
    }
    webpack.plugins.push(new CompressionPlugin(options));
    if (om.enabled('@mrbuilder/plugin-html')) {
        webpack.plugins.push(new HtmlWebpackChangeAssetsExtensionPlugin());
    }
    return webpack;
}
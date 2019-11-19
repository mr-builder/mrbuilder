const {DefinePlugin} = require('webpack');
const version = require('./version');
module.exports = function (conf, webpack) {
    webpack.plugins.unshift(new DefinePlugin(version(conf)));
    return webpack;
};

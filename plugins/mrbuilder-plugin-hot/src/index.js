const { NamedModulesPlugin, HotModuleReplacementPlugin } = require('webpack');

module.exports = function({
                      preEntry = ['react-hot-loader/patch'],
                      babel = require('mrbuilder-plugin-babel/babel-config'),
                      hot = true,
                      inline = true,
                      devtool,
                  }, webpack) {

    webpack.devtool = devtool || 'cheap-module-source-map';
    if (!webpack.devServer){
        webpack.devServer = {};
    }
    webpack.devServer.hot    = hot;
    webpack.devServer.inline = inline;

    if(webpack.entry) {
        webpack.entry = Object.keys(webpack.entry).reduce(function (ret, key) {
            ret[key] = preEntry.concat(webpack.entry[key]);
            return ret;
        }, {});
    }else{
        (this.info || console.log)('yikes no entry found');
    }
    webpack.plugins.push(new NamedModulesPlugin(),
        new HotModuleReplacementPlugin());

};

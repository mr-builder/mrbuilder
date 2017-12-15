const { cwd }    = require('mrbuilder-utils');
const DEV_SERVER = {
    filename          : 'index.js',
    historyApiFallback: true,
    inline            : true,
    contentBase       : cwd('public'),
    port              : 8082,

};

module.exports = function (opts, webpack) {
    const devServer = Object.assign({}, opts);
    delete devServer.loader;
    this.useHtml            = true;
    if (opts.devtool == null){
        webpack.devtool = 'eval'
    }
    delete devServer.devtool;
    webpack.devServer = Object.assign({}, DEV_SERVER, devServer);

    return webpack;
};

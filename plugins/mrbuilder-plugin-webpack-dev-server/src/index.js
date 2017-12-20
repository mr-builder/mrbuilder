const { cwd, parseEntry } = require('mrbuilder-utils');
const DEV_SERVER          = {
    filename          : 'index.js',
    historyApiFallback: true,
    inline            : true,
    contentBase       : cwd('public'),
    port              : 8082
};

module.exports = function (opts, webpack) {
    const devServer = Object.assign({}, DEV_SERVER, opts);
    delete devServer.loader;
    if (devServer.entry) {
        webpack.entry = parseEntry(devServer.entry);
    }
    this.useHtml = true;
    if (devServer.devtool == null) {
        webpack.devtool = 'eval-source-map'
    } else {
        webpack.devtool = devServer.devtool;
        delete devServer.devtool;
    }
    delete devServer.entry;
    webpack.devServer = devServer;
    delete devServer['useExternals'];
    delete devServer['noHot'];
    //webpack dev server started, not being able to find loglevel.
    // google didn't show much, so... this is the thing now.
    webpack.resolve.alias.loglevel = require.resolve('loglevel');
    return webpack;
};

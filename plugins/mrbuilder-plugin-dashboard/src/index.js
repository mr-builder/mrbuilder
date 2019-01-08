const DashboardPlugin = require('webpack-dashboard/plugin');
module.exports        = (options, webpack) => {
    if (!options.port){
        options.p
    }
    webpack.plugins.push(new DashboardPlugin({
        port:3001,
        ...options
    }));
    return webpack;
};
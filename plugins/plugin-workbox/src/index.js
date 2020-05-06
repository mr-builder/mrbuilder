const {GenerateSW,InjectManifest} = require('workbox-webpack-plugin');

module.exports = function(options, webpack, optionsManager){
    if (options.generateSW){
        webpack.plugins.push(new GenerateSW(options.generateSW));
    }
    if (options.injectManifest){
        webpack.plugins.push(new InjectManifest(options.injectManifest));
    }

    return webpack;
}

const {GenerateSW, InjectManifest} = require('workbox-webpack-plugin');

module.exports = function (options, webpack, optionsManager) {
    if (options.generateSW) {
        const {...generateSW} = options.generateSW;
        if (!generateSW.navigateFallback) {
            generateSW.navigateFallback = require('@mrbuilder/plugin-cra/src/config/paths')
                .publicUrlOrPath + 'index.html';
        }
        webpack.plugins.push(new GenerateSW(generateSW));
    }
    if (options.injectManifest) {
        webpack.plugins.push(new InjectManifest(options.injectManifest));
    }

    return webpack;
}

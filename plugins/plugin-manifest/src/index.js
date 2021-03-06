const ManifestPlugin = require('webpack-manifest-plugin');
const {join} = require('path');
const {asArray} = require('@mrbuilder/utils');

module.exports = function ({publicPath, fileName}, webpack, optionsManager) {
    publicPath = publicPath || om.config('@mrbuilder/cli.publicUrl', om.config('@mrbuilder/plugin-webpack.public', '/'));

    webpack.plugins.push(new ManifestPlugin({
        fileName,
        publicPath,
        generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
                manifest[file.name] = file.path;
                return manifest;
            }, seed);

            return {
                files: manifestFiles,
                entrypoints: Object.entries(entrypoints).reduce((ret, [key, value]) => {
                    ret[key] = asArray(value).filter(v => !v.endsWith('.map'));
                    return ret;
                }, {})
            }

        },
    }))

    return webpack;
}

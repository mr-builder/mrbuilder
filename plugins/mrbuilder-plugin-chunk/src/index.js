const { CommonsChunkPlugin } = require('webpack').optimize;

function chunks({
                    filename = '[name].[chunkhash].js',
                    manifest = 'manifest',
                    vendors = 'vendors',
                    excludes = [],
                    publicPath,
                    crossOriginLoading
                },
                webpack) {
    const info = this.info || console.log;
    if (this.isKarma) {
        info('do not run chunk in test mode');
        return;
    }
    const includes = [];
    if (manifest) {
        includes.push(manifest);
    }
    if (vendors) {
        includes.push(vendors);
    }

    if (this.isDevServer) {
        filename = filename.replace('[chunkhash].', '');
    }
    if (!webpack.output) {
        webpack.output = {};
    }
    webpack.output.chunkFilename = filename;
    if (crossOriginLoading){
        webpack.output.crossOriginLoading = crossOriginLoading;
    }
    if (manifest) {
        //CommonChunksPlugin will now extract all the common modules from
        // vendor and main bundles
        webpack.plugins.push(new CommonsChunkPlugin({
            publicPath,
            filename,
            name: manifest
        }));
    }
    if (vendors) {
        webpack.plugins.push(
            new CommonsChunkPlugin({
                name: vendors,
                filename,
                publicPath,
                minChunks(module) {
                    for (let i = 0, l = excludes.length; i < l; i++) {
                        if (typeof excludes[i].test == 'function') {
                            return excludes[i].test(module.context);
                        } else if (excludes[i] === module.context) {
                            return false;
                        }
                    }
                    // this assumes your vendor imports exist in the
                    // node_modules directory
                    return module.context && module.context.indexOf(
                        'node_modules')
                           !== -1;
                }
            }));

    }


}

module.exports = chunks;

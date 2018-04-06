function chunks({
                    filename = '[name].[chunkhash].js',
                    manifest = 'manifest',
                    vendors = 'vendors',
                    excludes = [],
                    publicPath,
                    crossOriginLoading,

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
    if (crossOriginLoading) {
        webpack.output.crossOriginLoading = crossOriginLoading;
    }
    if (!webpack.optimization) {
        webpack.optimization = {};
    }
    if (manifest) {
        webpack.optimization.runtimeChunk = {
            name: manifest
        };
    }

    if (!webpack.optimization.splitChunks) {
        webpack.optimization.splitChunks = {};
    }
    webpack.optimization.runtimeChunk =
        Object.assign({}, webpack.optimization.runtimeChunk, {
            name: manifest,
        });

    webpack.optimization.splitChunks =
        Object.assign({}, webpack.optimization.splitChunks, {
            chunks            : 'all',
            minSize           : 0,
            maxAsyncRequests  : Infinity,
            maxInitialRequests: Infinity,
            name              : true,
            cacheGroups       : {

                default: {
                    chunks            : 'async',
                    minSize           : 30000,
                    minChunks         : 2,
                    maxAsyncRequests  : 5,
                    maxInitialRequests: 3,
                    priority          : -20,
                    reuseExistingChunk: true,
                },
                vendor : {
                    name              : vendors,
                    enforce           : true,
                    test(module) {
                        for (let i = 0, l = excludes.length; i < l; i++) {
                            if (typeof excludes[i].test === 'function') {
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
                    },
                    priority          : -10,
                    reuseExistingChunk: true,
                },

                commons: {
                    name              : 'commons',
                    chunks            : 'initial',
                    minChunks         : 2,
                    priority          : -5,
                    reuseExistingChunk: true,
                }
            }
        });


    if (vendors) {
        if (!webpack.optimization.splitChunks.cacheGroups) {
            webpack.optimization.splitChunks.cacheGroups = {};
        }
        webpack.optimization.splitChunks.cacheGroups.vendors = false;
    }
    /* if (manifest) {
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

     }*/


}

module.exports = chunks;

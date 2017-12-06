const { parseRe } = require('mrbuilder-utils');

module.exports =
    ({
         filename = '[name].[hash].js',
         manifest = 'js/manifest',
         vendors = 'js/vendors',
         excludes = [],
         publicPath
     },
     webpack) => {
        if (!this.includes) {
            this.includes = [];
        }
        this.includes.push(manifest, vendors);

        if (this.isDevServer) {
            filename = '[name].js';
        }

        excludes = excludes.map(parseRe);

        webpack.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: vendors,
                filename,
                publicPath,
                minChunks(module) {
                    for (let i = 0, l = excludes.length; i < l; i++) {
                        if (excludes.test(module.context)) {
                            return false;
                        }
                    }
                    // this assumes your vendor imports exist in the
                    // node_modules directory
                    return module.context && module.context.indexOf(
                        'node_modules')
                           !== -1;
                }
            }),
            //CommonChunksPlugin will now extract all the common modules from
            // vendor and main bundles
            new webpack.optimize.CommonsChunkPlugin({
                publicPath,
                minChunks: Infinity,
                filename,
                name     : manifest
            }));

    };

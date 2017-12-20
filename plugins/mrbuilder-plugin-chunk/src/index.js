const { parseRe } = require('mrbuilder-utils');
const { CommonsChunkPlugin } = require('webpack').optimize;

function chunks({
         filename = '[name].[hash].js',
                    manifest = 'manifest',
                    vendors = 'vendors',
         excludes = [],
         publicPath
     },
                webpack) {
    const info = this.info || console.log;
    if (this.isKarma) {
        info('do not run chunk in test mode');
        return;
        }
    const includes = [];
    includes.push(manifest, vendors);

        if (this.isDevServer) {
            filename = '[name].js';
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

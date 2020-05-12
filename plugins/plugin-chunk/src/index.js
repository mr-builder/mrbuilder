function chunks({
                    filename = '[name].[chunkhash].js',
                    manifest = 'manifest',
                    vendors = 'vendors',
                    styles = 'styles',
                    commons,
                    excludes = [],
                    publicPath,
                    crossOriginLoading,
                    cacheGroups = {
                        default: {
                            chunks: 'async',
                            minSize: 30000,
                            minChunks: 2,
                            maxAsyncRequests: 5,
                            maxInitialRequests: 3,
                            priority: -20,
                            reuseExistingChunk: true,
                        }
                    },
                    splitChunks = {
                        chunks: 'all',
                        minSize: 0,
                        maxAsyncRequests: Infinity,
                        maxInitialRequests: Infinity,
                        name: true,
                    }
                },
                webpack) {
    const info = this.info || console.log;
    if (this.isKarma || this.isDevServer) {
        info('do not run chunk in test or devServer mode');
        return;
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
        if (manifest === true) {
            webpack.optimization.runtimeChunk = true;
        } else {
            if (!webpack.optimization.runtimeChunk) {
                webpack.optimization.runtimeChunk = {};
            }
            webpack.optimization.runtimeChunk.name = (entrypoint) => {
                return manifest.replace(/{\s*([^}]+?)\s*}/g, (v, a) => entrypoint[a])
            }

        }
    }


    if (vendors) {
        if (vendors === true) {
            vendors = 'vendors';
        }
        cacheGroups.vendor = {
            name: vendors,
            enforce: true,
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
            priority: -10,
            reuseExistingChunk: true,
            ...cacheGroups.vendor
        };
    }
    if (commons) {
        if (commons === true) {
            commons = 'commons';
        }

        cacheGroups.commons = {
            name: commons,
            chunks: 'initial',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
            ...cacheGroups.commons
        };
    }
    if (styles) {
        if (styles === true) {
            styles = 'styles';
        }
        cacheGroups.styles = {
            name: styles,
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
            ...cacheGroups.styles
        };
    }

    webpack.optimization.splitChunks = Object.assign({}, webpack.optimization.splitChunks, {
        ...splitChunks,
        cacheGroups
    });

}

module.exports = chunks;

require('@mrbuilder/plugin-browserslist');
const om = require('@mrbuilder/cli').default;
const {Info} = require('@mrbuilder/cli');

const {info} = om.logger('@mrbuilder/plugin-css');
const mrb = (v, def) => om.config('@mrbuilder/plugin-css' + (v ? `.${v}` : ''), def);
let useNameHash = mrb('useNameHash');
let filename = mrb('filename');
let useStyleLoaderLoader = mrb('useStyleLoader');
let publicPath = mrb('public', om.config('@mrbuilder/cli.publicUrl', om.config('@mrbuilder/plugin-webpack.public', '/'))) + '';
let chunkFilename = mrb('chunkFilename', `[name].style.css`);
if (useNameHash == null || useNameHash === true) {
    if (Info.isLibrary) {
        useNameHash = 'style.css';
    } else {
        useNameHash = '[id].[hash].style.css';
    }
} else if (useNameHash === false) {
    useNameHash = 'style.css';
}

if (Info.isDevServer) {
    useNameHash = useNameHash.replace('[hash].', '');
}
if (!filename) {
    filename = useNameHash;
}
info('naming style sheet', filename);
//So if its not turned on and its Karma than let's say that
// we don't use it.
if (process.env.NODE_ENV === 'test' || useStyleLoaderLoader == null && Info.isDevServer) {
    useStyleLoaderLoader = true;
}
let addedPlugin = false;

if (!useStyleLoaderLoader) {
    info('extracting text', filename);
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    module.exports = function useStyleExtractText(webpack, ...args) {
        const use = [MiniCssExtractPlugin.loader, ...args];
        const miniOpts = {
            filename,
            chunkFilename
        };
        if (publicPath) {
            miniOpts.publicPath = publicPath;
        }
        if (!addedPlugin) {
            addedPlugin = true;
            webpack.plugins.push(new MiniCssExtractPlugin(miniOpts));
            const cssProcessorPluginOptions = mrb('cssProcessorPluginOptions');
            if (cssProcessorPluginOptions) {
                const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
                const safePostCssParser = require('postcss-safe-parser');
                webpack.plugins.push(new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: mrb('sourceMap') ? {
                                // `inline: false` forces the sourcemap to be output into a
                                // separate file
                                inline: false,
                                // `annotation: true` appends the sourceMappingURL to the end of
                                // the css file, helping the browser find the sourcemap
                                annotation: true,
                            }
                            : false,
                    },
                    cssProcessorPluginOptions
                }));
            }
        }
        return use;
    };

} else {
    info('using style loader');
    module.exports = function useStyleWithStyleLoader(webpack, ...args) {
        return ['style-loader'].concat(args.filter(Boolean));
    };
}

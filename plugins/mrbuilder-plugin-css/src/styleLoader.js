if (!global._MRBUILDER_OPTIONS_MANAGER) {
    throw new Error('_MRBUILDER_OPTIONS_MANAGER not set');
}
require('mrbuilder-plugin-browserslist');
const om                 = global._MRBUILDER_OPTIONS_MANAGER;
const { info }           = om.plugins.get('mrbuilder-plugin-css');
const mrb                = (v) => om.config('mrbuilder-plugin-css' + (v
    ? `.${v}` : ''));
const { stringify }      = require('mrbuilder-utils');
let useNameHash          = mrb('useNameHash');
let useStyleLoaderLoader = mrb('useStyleLoader');
let publicPath           = mrb('publicPath');

let isDevServer = om.enabled('mrbuilder-plugin-webpack-dev-server');
let isLibrary   = om.config('mrbuilder-plugin-webpack.library');

if (useNameHash == null) {
    if (isLibrary) {
        useNameHash = 'style.css';
    } else {
        useNameHash = '[hash].style.css';
    }
} else if (useNameHash === true) {
    useNameHash = '[hash].style.css';
} else if (useNameHash === false) {
    useNameHash = 'style.css';
}
if (isDevServer) {
    useNameHash = useNameHash.replace('[hash].', '');
}
info('naming style sheet', useNameHash);
//So if its not turned on and its Karma than let's say that
// we don't use it.
if (useStyleLoaderLoader == null && isDevServer) {
    useStyleLoaderLoader = true;
}
let addedPlugin = false;

if (!useStyleLoaderLoader) {
    info('extracting text', useStyleLoaderLoader);
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    module.exports = function useStyleExtractText(webpack, ...args) {
            const use = [MiniCssExtractPlugin.loader, ...args];
            if (!addedPlugin) {
                addedPlugin = true;
                webpack.plugins.push(new MiniCssExtractPlugin({
                    filename     : useNameHash,
                    //chunkFilename: "[id].css"
                }));
            }
            return use;
        };

} else {
    info('using style loader');
    module.exports = function useStyleWithStyleLoader(webpack, ...args) {
        return ['style-loader'].concat(args.filter(Boolean));
    };
}

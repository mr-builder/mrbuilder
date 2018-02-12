if (!global._MRBUILDER_OPTIONS_MANAGER) {
    throw new Error('_MRBUILDER_OPTIONS_MANAGER not set');
}

const om       = global._MRBUILDER_OPTIONS_MANAGER;
const { info } = om.plugins.get('mrbuilder-plugin-css');
const mrb      = (v) => om.config('mrbuilder-plugin-css' + (v ? `.${v}` : ''));

let useNameHash      = mrb('useNameHash');
let useStyleLoaderLoader = mrb('useStyleLoader');
let publicPath       = mrb('publicPath');

let isDevServer      = om.enabled('mrbuilder-plugin-webpack-dev-server');
let isLibrary        = om.config('mrbuilder-plugin-webpack.library');

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

if (!useStyleLoaderLoader) {
    info('extracting text', useStyleLoaderLoader);
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    let addedPlugin = false;
    module.exports  = function useStyleExtractText(webpack, ...args) {
        const conf = { use: args.filter(Boolean) };
        if (publicPath) {
            conf.publicPath = publicPath;
        }
        if (!addedPlugin) {
            addedPlugin = true;
            webpack.plugins.push(new ExtractTextPlugin(useNameHash));
        }

        return ExtractTextPlugin.extract(conf);
    };

} else {
    info('using style loader');
    module.exports = function useStyleWithStyleLoader(webpack, ...args) {
        return ['style-loader'].concat(args.filter(Boolean));
    };
}

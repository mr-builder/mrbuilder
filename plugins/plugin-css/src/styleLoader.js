require('@mrbuilder/plugin-browserslist');
const om = require('@mrbuilder/cli').default;
const types = require('@mrbuilder/cli').info;

const {info} = om.logger('@mrbuilder/plugin-css');
const mrb = (v, def) => om.config('@mrbuilder/plugin-css' + (v ? `.${v}` : ''), def);
let useNameHash = mrb('useNameHash');
let filename = mrb('filename');
let useStyleLoaderLoader = mrb('useStyleLoader');
let publicPath = mrb('public');
let chunkFilename = mrb('chunkFilename', `[name].style.css`);
if (useNameHash == null || useNameHash === true) {
    if (types.isLibrary) {
        useNameHash = 'style.css';
    } else {
        useNameHash = '[id].[hash].style.css';
    }
} else if (useNameHash === false) {
    useNameHash = 'style.css';
}

if (types.isDevServer) {
    useNameHash = useNameHash.replace('[hash].', '');
}
if (!filename) {
    filename = useNameHash;
}
info('naming style sheet', filename);
//So if its not turned on and its Karma than let's say that
// we don't use it.
if (process.env.NODE_ENV === 'test' || useStyleLoaderLoader == null && types.isDevServer) {
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
        }
        return use;
    };

} else {
    info('using style loader');
    module.exports = function useStyleWithStyleLoader(webpack, ...args) {
        return ['style-loader'].concat(args.filter(Boolean));
    };
}

require('mrbuilder-plugin-browserslist');
const path                                            = require('path');
const optionsManager                                  = global._MRBUILDER_OPTIONS_MANAGER;
const { stringify, pkg, cwd, resolveMap, parseEntry } = require(
    'mrbuilder-utils');

const {
          DefinePlugin,
          optimize: {
              ModuleConcatenationPlugin
          }
      } = require('webpack');

const {
          warn  = console.warn,
          debug = console.warn,
          info  = console.log,
      } = optionsManager.logger('mrbuilder-plugin-webpack');

const isKarma     = optionsManager.enabled('mrbuilder-plugin-karma');
const isDevServer = optionsManager.enabled(
    'mrbuilder-plugin-webpack-dev-server');
const isDemo      = !!optionsManager.config('mrbuilder-plugin-webpack.demo');
const isApp       = !!optionsManager.config('mrbuilder-plugin-webpack.app');
let publicPath    = optionsManager.config('mrbuilder-plugin-webpack.public',
    '');
//So if you defined publicPath to /public/ it will parse as a regex.
// this fixes that.
if (publicPath instanceof RegExp) {
    publicPath = '' + publicPath;
}
const opts = {
    isProduction  : process.env.NODE_ENV === 'production',
    isLibrary     : optionsManager.config('mrbuilder-plugin-webpack.library')
                    || !(isKarma || isDevServer || isDemo || isApp),
    isKarma,
    isDemo,
    isApp,
    isDevServer,
    isHtml        : optionsManager.enabled('mrbuilder-plugin-html'),
    isHot         : optionsManager.enabled('mrbuilder-plugin-hot'),
    publicPath,
    outputPath    : optionsManager.config('mrbuilder-plugin-webpack.outputPath',
        cwd('lib')),
    outputFilename: optionsManager.config(
        'mrbuilder-plugin-webpack.outputFilename',
        '[name].js'),
    useScopeHoist : optionsManager.config(
        'mrbuilder-plugin-webpack.useScopeHoist', true),
    useTarget     : optionsManager.config('mrbuilder-plugin-webpack.target',
        'web'),
    useHtml       : !isKarma && (isDevServer || isDemo || isApp)
};
const mode = (val) => {
    switch (val) {
        case "development":
        case "test":
            return "development";
        case "production":
            return "production";
        default:
            return "none";
    }

};

let webpack = {
    mode   : mode(process.env.NODE_ENV),
    resolve: {
        alias: {}
    },

    resolveLoader: {
        modules: [
            'node_modules',
            cwd('node_modules'),
            path.resolve(__dirname, 'node_modules'),
        ],
        alias  : resolveMap('raw-loader')
    },
    output       : {
        path    : opts.outputPath,
        filename: opts.outputFilename,
        publicPath,
    },
    plugins      : [],
    module       : {
        rules: []
    }
};


//we take this away from webpack so we an expose it to the config.
(entryNoParse => {
    if (!entryNoParse) {
        return;
    }
    webpack.entry = Object.freeze(parseEntry(entryNoParse))
})(optionsManager.config('mrbuilder-plugin-webpack.entry'));

//This is where the magic happens
try {
    optionsManager.forEach((option, key) => {
        if (option.plugin) {
            const plugin = optionsManager.require(option.plugin);
            if (typeof plugin === 'function') {
                opts.warn        = option.warn;
                opts.info        = option.info;
                opts.debug       = option.debug;
                const tmpWebpack = plugin.call(opts, option.config || {},
                    webpack,
                    optionsManager);
                if (tmpWebpack) {
                    webpack = tmpWebpack;
                }
                option.info('loaded.');
            } else if (plugin) {
                option.info('not loaded');
                //TODO - better merge.
                //  webpack = Object.assign({}, webpack, option.plugin);
            }
        } else {
            option.info('disabled loading webpack plugin', key);
        }
    });
} catch (e) {
    warn('caught error', e);
    throw e;
}
//only define entry if it doesn't exist already.
if (!webpack.entry) {
    const _pkg = pkg();
    webpack.entry = { index: cwd(_pkg.source || 'src/index') };
    info('using default entry', webpack.entry.index)
}
if (opts.useDefine) {
    webpack.plugins.push(
        new DefinePlugin(
            Object.keys(opts.useDefine).reduce(function (ret, key) {
                ret[key] = JSON.stringify(opts.useDefine[key]);
                return ret;
            }, {})));
}


if (opts.useScopeHoist) {
    webpack.plugins.push(new ModuleConcatenationPlugin());
}


debug('DEBUG is on');
debug('optionsManager', stringify(optionsManager.plugins));
debug('webpack configuration', stringify(webpack));

module.exports = webpack;

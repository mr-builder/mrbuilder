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

const isKarma = optionsManager.enabled('mrbuilder-plugin-karma');
const opts    = {
    isProduction: process.env.NODE_ENV === 'production',
    isLibrary   : !(
        optionsManager.enabled('mrbuilder-plugin-karma') ||
        optionsManager.enabled('mrbuilder-plugin-webpack-dev-server') ||
        optionsManager.config('mrbuilder-plugin-webpack.demo') ||
        optionsManager.config('mrbuilder-plugin-webpack.app')
    ),

    isKarma,
    isDemo        : optionsManager.config('mrbuilder-plugin-webpack.demo'),
    isApp         : optionsManager.config('mrbuilder-plugin-webpack.app'),
    isDevServer   : optionsManager.enabled(
        'mrbuilder-plugin-webpack-dev-server'),
    isHot         : optionsManager.enabled('mrbuilder-plugin-hot'),
    publicPath    : optionsManager.config('mrbuilder-plugin-webpack.public',
        '/'),
    outputPath    : optionsManager.config('mrbuilder-plugin-webpack.outputPath',
        cwd('lib')),
    outputFilename: optionsManager.config(
        'mrbuilder-plugin-webpack.outputFilename',
        '[name].js'),
    useScopeHoist : optionsManager.config(
        'mrbuilder-plugin-webpack.useScopeHoist', true),
    useTarget     : optionsManager.config('mrbuilder-plugin-webpack.target',
        'web'),
    useHtml       : !isKarma &&
                    (optionsManager.enabled(
                            'mrbuilder-plugin-webpack-dev-server')
                     || optionsManager.config('mrbuilder-plugin-webpack.app') ||
                     optionsManager.config('mrbuilder-plugin-webpack.demo')
                    )
};

const packageJson = pkg();
let webpack       = {

    resolve: {
        alias: {
            [packageJson.name]: cwd(packageJson.source || packageJson.main
                                    || 'src')
        }
    },

    resolveLoader: {
        modules: [
            'node_modules',
            cwd('node_modules'),
            path.resolve(__dirname, 'node_modules'),
        ],
        alias  : resolveMap(
            'raw-loader',
            'json-loader'
        )
    },
    output       : {
        path    : opts.outputPath,
        filename: opts.outputFilename,
    },
    plugins      : [],
    module       : {
        rules: [

            {
                test  : /\.json$/,
                loader: 'json-loader'
            }
        ]
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

if (!webpack.entry) {
    webpack.entry = { index: cwd('src', 'index') };
    info('using default entry', webpack.entry.index)
}
debug('DEBUG is on');
debug('optionsManager', stringify(optionsManager.plugins));
debug('webpack configuration', stringify(webpack));

module.exports = webpack;

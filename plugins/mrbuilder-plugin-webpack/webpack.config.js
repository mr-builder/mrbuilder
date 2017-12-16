require('mrbuilder-plugin-browserslist');
const path                                = require('path');
const optionsManager                      = global._MRBUILDER_OPTIONS_MANAGER;
const { stringify, pkg, cwd, resolveMap } = require('mrbuilder-utils');
const { MRBUILDER_ENTRY }                 = process.env;
const {
          DefinePlugin,
          optimize: {
              ModuleConcatenationPlugin
          }
      }                                   = require('webpack');

let {
        warn  = console.warn,
        debug = console.warn
    } = optionsManager;

const isKarma =
          optionsManager.enabled('mrbuilder-plugin-karma')
const opts    = {
    isProduction  : process.env.NODE_ENV === 'production',
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
    entry         : optionsManager.config('mrbuilder-plugin-webpack.entry'),
    useHtml       : !isKarma &&
                    (optionsManager.enabled(
                            'mrbuilder-plugin-webpack-dev-server')
                     || optionsManager.config('mrbuilder-plugin-webpack.app') ||
                     optionsManager.config('mrbuilder-plugin-webpack.demo')
                    )
};
debug('using options', stringify(opts));


//if its not anything else its a library.

const packageJson = pkg();
let webpack       = {

    resolve      : {
        alias: {
            [packageJson.name]: cwd(packageJson.source || packageJson.main
                                    || 'src')
        }
    },
    entry        : {
        index: cwd('src/index')
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
if (MRBUILDER_ENTRY) {
    let entry = {};
    let entryNoParse;
    try {
        entryNoParse = JSON.parse(MRBUILDER_ENTRY);
    } catch (e) {
        entryNoParse = JSON.parse('"' + MRBUILDER_ENTRY + '"');
    }
    const isStr = typeof entryNoParse === 'string';
    if (isStr || Array.isArray(entryNoParse)) {
        entryNoParse = isStr ? entryNoParse.split(/,\s*/) : entryNoParse;

        for (let i = 0, l = entryNoParse.length; i < l; i++) {
            const parts = entryNoParse[i].split('=', 2);
            let key     = parts[0], value = parts[1];
            if (!value) {
                value = key;
                key   = path.basename(key);
            }
            if (entry[key]) {
                if (Array.isArray(entry[key])) {
                    entry[key].push(value);
                } else {
                    entry[key] = [entry[key], value];
                }
            } else {
                entry[key] = value;
            }
        }
    } else {
        entry = entryNoParse;
    }
    webpack.entry = entry;
}

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

debug('DEBUG is on');
debug('optionsManager', stringify(optionsManager.plugins));
debug('webpack configuration', stringify(webpack));

module.exports = webpack;

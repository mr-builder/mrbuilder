require('mrbuilder-plugin-browserslist');
const path           = require('path');
const optionsManager =  global._MRBUILDER_OPTIONS_MANAGER;

console.log('optionsManager', JSON.stringify(optionsManager,null,2));
const webpackUtils   = require('mrbuilder-utils');
const {
          DefinePlugin,
          optimize: {
              ModuleConcatenationPlugin
          }
      }              = require('webpack');
const configOrBool   = webpackUtils.configOrBool,
      camelCased     = webpackUtils.camelCased,
      resolveMap     = webpackUtils.resolveMap,
      cwd            = webpackUtils.cwd,
      pkg            = webpackUtils.pkg;


const {
          NODE_ENV         = process.argv.includes('-p')
              ? 'production'
              : 'development',
          MRBUILDER_DEBUG,
          MRBUILDER_TARGET = 'web',
          MRBUILDER_OUTPUT_PATH,
          MRBUILDER_MAIN_FIELDS,
          MRBUILDER_OUTPUT_FILENAME,
          MRBUILDER_ENTRY,
          MRBUILDER_LIBRARY,
          MRBUILDER_LIBRARY_TARGET,
          MRBUILDER_USE_HOT,
          MRBUILDER_DEV_SERVER,
          MRBUILDER_KARMA,
          MRBUILDER_DEMO,
          MRBUILDER_PUBLIC,
          MRBUILDER_USE_NAME_HASH,
          MRBUILDER_ANALYZE,
          MRBUILDER_USE_ANALYTICS
      } = process.env;


const plugins = [];
const opts    = {
    isProduction : NODE_ENV === 'production',
    isKarma      : optionsManager.enabled('mrbuilder-plugin-karma'),
    isDemo       : optionsManager.enabled('mrbuilder-plugin-server'),
    isDevServer  : optionsManager.enabled('mrbuilder-plugin-webpack'),
    publicPath   : configOrBool(MRBUILDER_PUBLIC, '/'),
    useScopeHoist: true,
    useTarget    : MRBUILDER_TARGET,
    analyze      : configOrBool(MRBUILDER_ANALYZE, 'static'),
};


const output = {
    filename: configOrBool(MRBUILDER_OUTPUT_FILENAME, opts.useNameHash)
              || opts.useNameHash || '[name].js',
    path    : configOrBool(MRBUILDER_OUTPUT_PATH, cwd('lib'))
              || cwd('lib')
};

//if its not anything else its a library.
let externals = [];
if (!(opts.isKarma || opts.isDevServer || opts.isDemo)) {
    opts.isLibrary      = true;
    const library       = configOrBool(MRBUILDER_LIBRARY),
          libraryTarget = configOrBool(MRBUILDER_LIBRARY_TARGET, 'umd');

    if (library === true || library === false) {
        output.library = camelCased(pkg().name);
    } else {
        output.library = library;
    }
    if (libraryTarget) {
        output.libraryTarget = libraryTarget;
    }
    externals = Object.keys(pkg().peerDependencies || {});
}
//Any time a peerDependencies is defined, we will make it an
// extenral

let webpack = {

    resolve      : {
        extensions: ['.js', '.jsx'],
        alias     : {}
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
    output,
    plugins,
    externals,
    module       : {
        rules: [

            {
                test  : /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};


webpack.resolve.alias = Object.assign(webpack.resolve.alias,
    resolveMap('react', 'react-dom'));


//if (MRBUILDER_MAIN_FIELDS) {
const mainFields = configOrBool(MRBUILDER_MAIN_FIELDS,
    opts.useTarget === 'web' ? ['source', 'browser', 'main']
        : ['source', 'main']);
if (mainFields) {
    webpack.resolve.mainFields =
        Array.isArray(mainFields) ? mainFields : mainFields.split(
            /,\s*/);
    console.warn(`using mainFields`, webpack.resolve.mainFields);
}

//}


opts.useHot = configOrBool(MRBUILDER_USE_HOT);


((idx) => {
    if (idx != -1) {
        opts.target = process.argv[idx + 1];
        process.argv.splice(idx, 2);
    }
})(process.argv.indexOf('--target'));


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
} else {
    if (opts.isDemo || configOrBool(MRBUILDER_DEV_SERVER)) {
        if (!webpack.entry || (Object.keys(webpack.entry).length === 1)) {
            webpack.entry = { index: cwd('public', 'index') };
        }
    } else if (!webpack.entry && !opts.isKarma) {
        webpack.entry = { index: cwd('src', 'index') };
    }
}

//This is where the magic happens
try {
    optionsManager.plugins.forEach((option, key) => {
        if (option.plugin) {
            console.warn('loading webpack plugin %s=%O from ', key, option.config, option.plugin);
            const plugin = optionsManager.require(option.plugin);
            if (typeof plugin === 'function') {
                const tmpWebpack = plugin.call(opts, option.config || {},
                    webpack,
                    optionsManager);
                if (tmpWebpack) {
                    webpack = tmpWebpack;
                }
            } else if (plugin) {
                //TODO - better merge.
              //  webpack = Object.assign({}, webpack, option.plugin);
            }
        } else {
            console.warn('disabled loading webpack plugin', key);
        }
    });
} catch (e) {
    console.warn('optionsManager', JSON.stringify(optionsManager, null, 2));
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

if (MRBUILDER_DEBUG) {
    /* console.log('webpack opts %s, webpack %O', JSON.stringify(opts), JSON.stringify(webpack));*/
    console.log('DEBUG is on');
    console.log('optionsManager');
    console.log(JSON.stringify(optionsManager, null, 2));
    console.log('webpack configuration');
    console.log(JSON.stringify(webpack, null, 2));
}
module.exports = webpack;

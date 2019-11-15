require('@mrbuilder/plugin-browserslist');
const path = require('path');
const optionsManager = global._MRBUILDER_OPTIONS_MANAGER;
const {stringify, pkg, cwd, parseEntry} = require('@mrbuilder/utils');
const {
    DefinePlugin,
    optimize: {
        ModuleConcatenationPlugin
    }
} = require('webpack');

const {
    warn = console.warn,
    debug = console.warn,
    info = console.log,
} = optionsManager.logger('@mrbuilder/plugin-webpack');

const countSlash = (v) => {
        if (!v) {
            return 0;
        }
        let count = 0;
        for (let i = 0, l = v.length; i < l; i++) {
            if (v[i] === path.sep) {
                count++;
            }
        }
        return count;
    },
    sortByDepth = (b, a) => countSlash(a) - countSlash(b);

let publicPath = optionsManager.config('@mrbuilder/plugin-webpack.public', '');
//So if you defined publicPath to /public/ it will parse as a regex.
// this fixes that.
if (publicPath instanceof RegExp) {
    publicPath = '' + publicPath;
}
const opts = {
    ...require('@mrbuilder/cli/src/info'),
    publicPath,
    outputPath: optionsManager.config('@mrbuilder/plugin-webpack.outputPath', cwd('lib')),
    outputFilename: optionsManager.config('@mrbuilder/plugin-webpack.outputFilename', '[name].js'),
    useScopeHoist: optionsManager.config('@mrbuilder/plugin-webpack.useScopeHoist', true),
    useTarget: optionsManager.config('@mrbuilder/plugin-webpack.target', 'web')
};

let webpack = {
    resolve: {
        alias: {}
    },

    resolveLoader: {
        modules: [
            'node_modules',
            cwd('node_modules'),
            path.resolve(__dirname, 'node_modules'),
        ],
        alias: {}
    },
    output: {
        path: opts.outputPath,
        filename: opts.outputFilename,
        publicPath,
    },
    plugins: [],
    module: {
        rules: []
    }
};


//we take this away from webpack so we an expose it to the config.
(entryNoParse => {
    if (!entryNoParse) {
        return;
    }
    webpack.entry = Object.freeze(parseEntry(entryNoParse))
})(optionsManager.config('@mrbuilder/plugin-webpack.entry'));

//This is where the magic happens
const resolveWebpack = (__webpack) => new Promise((res, rej) => {
    let p = Promise.resolve(__webpack);


    optionsManager.forEach((option, key) => {
        if (option.plugin) {

            let plugin;
            try {
                plugin = optionsManager.require(option.plugin);
            } catch (e) {
                warn(`error loading plugin '${key}' from '${option && option.plugin}'`, e);
                throw e;
            }

            if (typeof plugin === 'function') {
                p = p.then(_webpack => {
                    try {
                        return plugin.call(option, option.config || {}, _webpack, optionsManager)
                    } catch (e) {
                        console.error(`Error in '${option.name}'`, e);
                        throw e;
                    }
                }).then(tmpWebpack => {
                    option.info(option.name, 'loaded.');
                    if (tmpWebpack) {
                        return tmpWebpack
                    }
                    return __webpack;
                });

            } else if (plugin) {
                option.info('not loaded');
                //TODO - better merge.
                //  webpack = Object.assign({}, webpack, option.plugin);
            }
        } else {
            option.info('disabled loading webpack plugin', key);
        }
    });
    return p.then(w => {
        opts.debug = debug;
        opts.info = info;
        opts.warn = warn;
        return w;
    }).then(res, rej);
});

module.exports = resolveWebpack(webpack).then(webpack => {

//only define entry if it doesn't exist already.
    if (!webpack.entry) {
        const _pkg = pkg();
        webpack.entry = {index: cwd(_pkg.source || 'src/index')};
        info('using default entry', webpack.entry.index)
    }
    if (opts.useDefine) {
        webpack.plugins.unshift(
            new DefinePlugin(Object.keys(opts.useDefine).reduce(function (ret, key) {
                ret[key] = JSON.stringify(opts.useDefine[key]);
                return ret;
            }, {})));
    }


    if (opts.useScopeHoist) {
        webpack.plugins.push(new ModuleConcatenationPlugin());
    }
    /**
     * This is an attempt to fix webpack.resolve.alias.   Currently it uses whatever
     * was added first to match, rather than what is most specific; which is almost
     * certainly what you want; that is the deepest (most slashes) are matched first,
     * as they are more specific.
     */
    if (webpack.resolve.alias) {
        webpack.resolve.alias = Object.keys(webpack.resolve.alias)
            .sort(sortByDepth)
            .reduce((ret, key) => {
                ret[key] = webpack.resolve.alias[key];
                return ret;
            }, {});
    }
    debug('DEBUG is on');
    debug('optionsManager', stringify(optionsManager.plugins));
    debug('webpack configuration', stringify(webpack));
    info('output filename', webpack.output.filename);

    return webpack;
}, (err) => {
    warn('optionsManager', stringify(optionsManager));
    warn('webpack configuration', stringify(webpack));
    throw err;
});


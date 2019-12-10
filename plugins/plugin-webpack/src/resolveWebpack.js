const path = require('path');
const optionsManager = require('@mrbuilder/cli').default;
const {stringify, pkg, cwd, parseEntry} = require('@mrbuilder/utils');
const scope = require('@mrbuilder/cli').info;
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
const OPTS = {
    ...require('@mrbuilder/cli').info,
    publicPath,
    outputPath: optionsManager.config('@mrbuilder/plugin-webpack.outputPath', cwd('lib')),
    outputFilename: optionsManager.config('@mrbuilder/plugin-webpack.outputFilename', '[name].js'),
    useScopeHoist: optionsManager.config('@mrbuilder/plugin-webpack.useScopeHoist', true),
    useTarget: optionsManager.config('@mrbuilder/plugin-webpack.target', 'web')
};

const WEBPACK_CONFIG = {
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
        // path: opts.outputPath,
        // filename: opts.outputFilename,
        publicPath,
    },
    plugins: [],
    module: {
        rules: []
    }
};
const reorderAlias = (webpack) => {
    if (webpack.resolve.alias) {
        webpack.resolve.alias = Object.keys(webpack.resolve.alias)
            .sort(sortByDepth)
            .reduce((ret, key) => {
                ret[key] = webpack.resolve.alias[key];
                return ret;
            }, {});
    }
    return webpack;
};
const DONE = webpack => {

//only define entry if it doesn't exist already.
    if (!webpack.entry) {
        webpack.entry = {index: optionsManager.cwd(optionsManager.topPackage.source || 'src/index')};
        info('using default entry', webpack.entry.index)
    }
    /**
     * This is an attempt to fix webpack.resolve.alias.   Currently it uses whatever
     * was added first to match, rather than what is most specific; which is almost
     * certainly what you want; that is the deepest (most slashes) are matched first,
     * as they are more specific.
     */

    debug('DEBUG is on');
    debug('optionsManager', stringify(optionsManager.plugins));
    debug('webpack configuration', stringify(webpack));
    info('output filename', webpack.output.filename);

    return webpack;
}

//we take this away from webpack so we an expose it to the config.
(entryNoParse => {
    if (!entryNoParse) {
        return;
    }
    WEBPACK_CONFIG.entry = Object.freeze(parseEntry(entryNoParse))
})(optionsManager.config('@mrbuilder/plugin-webpack.entry'));


module.exports = (conf = WEBPACK_CONFIG, opts = OPTS, onDone = DONE) => {
    if (opts.outputPath) {
        conf.output.path = opts.outputPath;
    }
    if (opts.outputFilename) {
        conf.output.filename = opts.outputFilename;
    }
//This is where the magic happens
    const resolveWebpack = (__webpack) => new Promise((res, rej) => {
        let p = Promise.resolve(__webpack);


        optionsManager.forEach((option, key) => {
            if (option.plugin) {

                let plugin;
                try {
                    plugin = optionsManager.require(Array.isArray(option.plugin) ? option.plugin[0] : option.plugin);
                } catch (e) {
                    warn(`not loading plugin '${key}' from '${option && option.plugin}'`);
                    if (e.code !== 'MODULE_NOT_FOUND') {
                        throw e;
                    }
                }

                if (typeof plugin === 'function') {
                    p = p.then(_webpack => {
                        try {
                            return plugin.call(scope, option.config || {}, _webpack, optionsManager)
                        } catch (e) {
                            warn(`Error in '${option.name}'`, e);
                            throw e;
                        }
                    }).then(tmpWebpack => {
                        info(option.name, 'loaded.');
                        if (tmpWebpack) {
                            return tmpWebpack
                        }
                        return __webpack;
                    });

                } else if (plugin) {
                    info('not loaded');
                    //TODO - better merge.
                    //  webpack = Object.assign({}, webpack, option.plugin);
                }
            } else {
                info('disabled loading webpack plugin', key);
            }
        });
        return p.then(res, rej);
    });

    return resolveWebpack(conf).then(reorderAlias).then(onDone, (err) => {
        throw err;
    });
};


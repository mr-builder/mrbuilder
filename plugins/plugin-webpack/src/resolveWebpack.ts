import optionsManager from '@mrbuilder/cli';
import {Option} from '@mrbuilder/optionsmanager';
import {stringify, cwd, parseEntry} from '@mrbuilder/utils';
import * as path from 'path';
import * as Webpack from 'webpack';

const scope = optionsManager.info;
const {
    warn = console.warn,
    debug = console.warn,
    info = console.log,
} = optionsManager.logger('@mrbuilder/plugin-webpack');

const countSlash = (v: string): number => {
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
    sortByDepth = ([b]: [string, string], [a]: [string, string]): number => countSlash(a) - countSlash(b);

//So if you defined publicPath to /public/ it will parse as a regex.
// this fixes that.
const publicPath = optionsManager.config('@mrbuilder/plugin-webpack.public', '') + '';

const OPTS = {
    ...info,
    publicPath,
    outputPath: optionsManager.config('@mrbuilder/plugin-webpack.outputPath', cwd('lib')),
    outputFilename: optionsManager.config('@mrbuilder/plugin-webpack.outputFilename', '[name].js'),
    useScopeHoist: optionsManager.config('@mrbuilder/plugin-webpack.useScopeHoist', true),
    useTarget: optionsManager.config('@mrbuilder/plugin-webpack.target', 'web')
};

const WEBPACK_CONFIG: Webpack.Configuration = {
    resolve: {
        alias: {},
        modules: ['node_modules']
    },

    resolveLoader: {
        modules: [
            'node_modules',
            cwd('node_modules'),
            path.resolve(__dirname, '..', 'node_modules'),
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

const reorderAlias = (configuration: Webpack.Configuration): Webpack.Configuration => {
    if (configuration.resolve.alias) {
        configuration.resolve.alias = Object.entries(configuration.resolve.alias)
            .sort(sortByDepth)
            .reduce((ret, [key, value]) => {
                ret[key] = value;
                return ret;
            }, {} as Webpack.Configuration["resolve"]["alias"]);
    }
    return configuration;
};
const DONE = (webpack: Webpack.Configuration) => {

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
};

//we take this away from webpack so we an expose it to the config.
(entryNoParse => {
    if (!entryNoParse) {
        return;
    }
    WEBPACK_CONFIG.entry = Object.freeze(parseEntry(entryNoParse))
})(optionsManager.config('@mrbuilder/plugin-webpack.entry'));

export default async (conf = WEBPACK_CONFIG, opts = OPTS, onDone = DONE): Promise<Webpack.Configuration> => {
    if (opts.outputPath) {
        conf.output.path = opts.outputPath;
    }
    if (opts.outputFilename) {
        conf.output.filename = opts.outputFilename;
    }
//This is where the magic happens

    const options: [Option, string][] = [];

    optionsManager.forEach((option, key) => option.plugin ? options.push([option, key]) : null);

    for (const [option, key] of options) {
        let plugin: Function;
        try {
            plugin = optionsManager.require(Array.isArray(option.plugin) ? option.plugin[0] : option.plugin);
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            warn(`was not found '${key}' from '${option && option.plugin}'`);
            continue;
        }
        if (typeof plugin === 'function') {
            try {
                const ret = await plugin.call(scope, option.config || {}, conf, optionsManager);
                conf = ret || conf;
            } catch (e) {
                console.trace(e);
                warn(`Error in '${option.name}'`, e);
                throw e;
            }
            info(option.name, 'loaded.');
        } else if (plugin) {
            info('not loaded');
        }
    }

    return onDone(reorderAlias(conf));
};


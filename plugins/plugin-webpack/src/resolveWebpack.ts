import optionsManager, {logger} from '@mrbuilder/cli';
import {stringify, cwd, parseEntry} from '@mrbuilder/utils';
import * as path from 'path';
import * as Webpack from 'webpack';

const scope = optionsManager.logger('@mrbuilder/plugin-webpack');

const {info, debug} = scope;

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

export const resolveWebpack = async (conf = WEBPACK_CONFIG, opts = OPTS, onDone = DONE): Promise<Webpack.Configuration> => {
    if (opts.outputPath) {
        conf.output.path = opts.outputPath;
    }
    if (opts.outputFilename) {
        conf.output.filename = opts.outputFilename;
    }
//This is where the magic happens
    logger.enableProgress();
    conf = await optionsManager.initialize(conf, scope);
    logger.disableProgress();
    if (conf?.resolve?.extensions?.length) {
        conf.resolve.extensions = Array.from(new Set(conf.resolve.extensions));
    }

    return onDone(reorderAlias(conf));
};


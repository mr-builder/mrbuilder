import {optionsManager, Info, dotExtensions} from '@mrbuilder/cli';
import {logObject} from '@mrbuilder/utils';
import * as path from 'path';
import * as Webpack from 'webpack';
import {initialConfig} from './initialConfig';

const scope = optionsManager.logger('@mrbuilder/plugin-webpack');

if (!optionsManager.enabled('@mrbuilder/plugin-webpack')) {
    scope.warn(`@mrbuilder/plugin-webpack needs to be enabled for this function to execute correctly`);
}
const {info} = scope;
const SOURCE_MAIN_FIELDS = ['source', 'browser', 'module', 'main'];

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
const publicPath = optionsManager.config('@mrbuilder/plugin-webpack.public',
    optionsManager.config('@mrbuilder/cli.publicUrl', './')
) + '';


const OPTS = {
    ...info,
    publicPath,
    outputPath: optionsManager.cwd(optionsManager.config('@mrbuilder/plugin-webpack.outputPath', optionsManager.config('@mrbuilder/cli.outputDir', 'lib'))),
    outputFilename: optionsManager.config('@mrbuilder/plugin-webpack.outputFilename', '[name].js'),
    useScopeHoist: optionsManager.config('@mrbuilder/plugin-webpack.useScopeHoist', true),
    useTarget: optionsManager.config('@mrbuilder/plugin-webpack.target', 'web')
};

export const WEBPACK_CONFIG: Webpack.Configuration = initialConfig.call(
    optionsManager.logger('@mrbuilder/plugin-webpack'),
    optionsManager.config('@mrbuilder/plugin-webpack'), {
        resolve: {
            alias: {},
            modules: ['node_modules'],
            extensions: dotExtensions,
        },

        resolveLoader: {
            modules: [
                'node_modules',
                optionsManager.cwd('node_modules'),
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
    }, optionsManager);
/**
 * This is an attempt to fix webpack.resolve.alias.   Currently it uses whatever
 * was added first to match, rather than what is most specific; which is almost
 * certainly what you want; that is the deepest (most slashes) are matched first,
 * as they are more specific.
 */
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
    }
    info('using entry', webpack.entry);


    logObject('webpack configuration', Info.isDebug, webpack);
    info('output filename', webpack.output.filename);

    return webpack;
};


export const resolveWebpack = async (conf = WEBPACK_CONFIG, opts = OPTS, onDone = DONE): Promise<Webpack.Configuration> => {
    if (opts.outputPath) {
        conf.output.path = opts.outputPath;
    }
    if (opts.outputFilename) {
        conf.output.filename = opts.outputFilename;
    }
    let mainFields = optionsManager.config('@mrbuilder/plugin-webpack.mainFields', true);
    if (mainFields) {
        mainFields = typeof mainFields === 'string' ? mainFields.split(/,\s*/) : mainFields;
        if (mainFields === true){
            mainFields = conf.target === 'node' ? ['source', 'module', 'main'] : SOURCE_MAIN_FIELDS
        }
        conf.resolve.mainFields = mainFields;
        info(`using mainFields`, mainFields);
    }
    conf = await optionsManager.initialize(conf, scope);
    if (conf?.resolve?.extensions?.length) {
        conf.resolve.extensions = Array.from(new Set(conf.resolve.extensions)).map(v => `.${v.replace(/^[.]/, '')}`);
    }
    return onDone(reorderAlias(conf));
};


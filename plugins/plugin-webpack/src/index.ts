import {info, Info} from '@mrbuilder/cli';
import {OptionsManager} from "@mrbuilder/optionsmanager";
import {camelCased, cwd, stringify, enhancedResolve} from '@mrbuilder/utils';
import {OutputOptions, WebpackOptions} from "webpack/declarations/WebpackOptions";
import {deepMerge} from './deepMerge';
import processAlias from "./processAlias";
import {MrBuilderWebpackPluginOptions, StringObject} from './types';

export * from './resolveWebpack';

const DEFAULT_MAIN_FIELDS = ['browser', 'main'];
const SOURCE_MAIN_FIELDS = ['source', 'browser', 'main'];

const returnMode = (val = process.env.NODE_ENV) => {
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

const mod = function ({
                          library,
                          libraryTarget = 'umd',
                          extensions = ['.js', '.jsx', '.json'],
                          mainFields = true,
                          app,
                          mode,
                          //we don't handle entry here
                          entry,
                          demo,
                          outputPath = cwd('lib'),
                          useExternals,
                          externalizePeers = true,
                          externals,
                          devtool = 'source-map',
                          filename = '[name].[hash].js',
                          globalObject,
                          alias = [],
                          performance,
                          node,
                          noParse,
                          target,
                          bail,
                          chunkFilename,
                          resolve = {},
                          ...rest
                      }: MrBuilderWebpackPluginOptions, webpack: WebpackOptions, om: OptionsManager) {
    //@ts-ignore
    delete rest['@babel'];
    if (performance) {
        webpack.performance = performance;
    }
    webpack.resolve = deepMerge(webpack.resolve, resolve);
    webpack.mode = webpack.mode || returnMode(mode);
    webpack.bail = bail != null ? bail : Info.isProduction;
    const logger = om.logger('@mrbuilder/plugin-webpack');
    logger.info('webpack mode ', webpack.mode);
    //ugh - just do it.
    delete rest.public;
    //If its not in
    if (Object.keys(rest).length > 0) {
        logger.info(`Using a not explicitly supported webpack feature, 
        this will make your configuration bound to whatever version of webpack you are using. 
        mrbuilder will not be able to manage the version differences for you.
        
        The mrbuilder unsupported keys are '${Object.keys(rest)}'
                
        `);
        Object.assign(webpack, rest);
    }


    if (target) {
        webpack.target = target;
    }
    if (!webpack.resolve) {
        webpack.resolve = {
            alias: {}
        };
    }
    if (noParse) {

        if (!webpack.module) {
            webpack.module = {noParse};
        } else {
            webpack.module.noParse = noParse;
        }


    }

    const pkgPath = cwd('package.json');
    const pkg = require(pkgPath);

    processAlias(webpack, alias);

    const output: OutputOptions = webpack.output || (webpack.output = {});
    if (globalObject) {
        output.globalObject = globalObject;
    }

    if (outputPath) {
        //webpack wants an absolute path here.
        output.path = enhancedResolve(outputPath);
    }
    if (chunkFilename) {
        output.chunkFilename = chunkFilename;
    }

    demo = demo || app;

    if (info.isLibrary) {
        output.library = typeof library === 'string' ? library : camelCased(pkg.name);
        output.libraryTarget = libraryTarget;
        //Don't hash when its a library
        output.filename = filename.replace('[hash].', '');

        logger.info(`building as library with name "${output.library}"`)

    } else if (info.isDevServer) {
        //Don't hash when its running in devServer
        output.filename = filename.replace('[hash].', '');
    } else {
        output.filename = filename;
    }
    if (demo) {
        output.path = demo === true ? cwd('demo') : cwd(demo);
    }


    if (extensions) {
        if (!webpack.resolve.extensions) {
            webpack.resolve.extensions = [];
        }
        webpack.resolve.extensions.push(...extensions)
    }

    if (info.isLibrary && (useExternals !== false)) {

        let externals: string[] = [];
        if (Array.isArray(useExternals)) {
            externals = useExternals;
        } else if (typeof useExternals === 'string') {
            externals = (useExternals.split(/,\s*/) as string[]);
        }

        if (externalizePeers && pkg.peerDependencies) {
            externals = externals.concat(Object.keys(pkg.peerDependencies));
        }
        const wexternals = webpack.externals ? Array.isArray(webpack.externals) ? webpack.externals : (webpack.externals = [webpack.externals]) : (webpack.externals = []);
        webpack.externals = wexternals.concat(Object.keys(externals.reduce((ret: StringObject, key) => {
            ret[key] = key;
            return ret;
        }, {})));

        logger.info('packaging as externalize', webpack.externals);
    }

    if (mainFields) {
        mainFields = typeof mainFields === 'string' ? mainFields.split(/,\s*/) : mainFields;
        mainFields = Array.isArray(mainFields) ? mainFields : mainFields === true
            ? webpack.target === 'node' ? ['source', 'main'] : SOURCE_MAIN_FIELDS
            : DEFAULT_MAIN_FIELDS;

        webpack.resolve.mainFields = mainFields;
        logger.info(`using mainFields`, mainFields);
    }
    if (node) {
        webpack.node = Object.assign({}, webpack.node, node);
        logger.info('using node config', stringify(webpack.node));
    }

    webpack.devtool = devtool;

    return webpack;


};

module.exports = mod;

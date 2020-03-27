import {OptionsManager} from "@mrbuilder/optionsmanager";
import {camelCased, cwd, stringify, enhancedResolve} from '@mrbuilder/utils';
import {OutputOptions, WebpackOptions} from "webpack/declarations/WebpackOptions";
import processAlias from "./processAlias";
import {MrBuilderWebpackPluginOptions, StringObject} from './types';

export {default as processAlias} from './processAlias';

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
                          node,
                          noParse,
                          target,
                          resolve = {},
                          ...rest
                      }: MrBuilderWebpackPluginOptions, webpack: WebpackOptions, om: OptionsManager) {
    webpack.resolve = resolve;
    webpack.mode = webpack.mode || returnMode(mode);
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

    demo = demo || app;

    if (this.isLibrary) {
        output.library = typeof library === 'string' ? library : camelCased(pkg.name);
        output.libraryTarget = libraryTarget;
        //Don't hash when its a library
        output.filename = filename.replace('[hash].', '');

        logger.info(`building as library with name "${output.library}"`)

    } else if (this.isDevServer) {
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

    if (this.isLibrary && (useExternals !== false)) {

        let externals: string[] = [];
        if (Array.isArray(useExternals)) {
            externals = useExternals;
        } else if (typeof useExternals === 'string') {
            externals = (useExternals.split(/,\s*/) as string[]);
        }

        if (externalizePeers && pkg.peerDependencies) {
            externals = externals.concat(Object.keys(pkg.peerDependencies));
        }
        const wexternals = webpack.externals || (webpack.externals = []);
        if (Array.isArray(wexternals)) {
            webpack.externals = wexternals.concat(Object.keys(externals.reduce((ret: StringObject, key) => {
                ret[key] = key;
                return ret;
            }, {})));
        }

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

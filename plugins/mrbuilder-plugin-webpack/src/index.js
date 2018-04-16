const { camelCased, cwd, resolveMap, enhancedResolve, regexOrFuncApply } = require(
    'mrbuilder-utils');
const DEFAULT_MAIN_FIELDS                                                = ['browser', 'main'];
const SOURCE_MAIN_FIELDS                                                 = ['source', 'browser', 'main'];

const mod = function ({
                          library,
                          libraryTarget = 'commonjs2',
                          extensions = ['.js', '.jsx', '.json'],
                          mainFields = true,
                          app,
                          entry,
                          demo,
                          outputPath = cwd('lib'),
                          useExternals,
                          externalizePeers = true,
                          externals,
                          devtool = 'source-maps',
                          filename = '[name].[hash].js',
                          alias = [],
                          node,
                          noParse,
                          ...rest,
                      },
                      webpack, om) {
    //If its not in
    Object.assign(webpack, rest);
    if (!webpack.resolve) {
        webpack.resolve = {
            alias: {}
        };
    }
    if (noParse) {

        if (!webpack.module) {
            webpack.module = { noParse };
        } else {
            webpack.module.noParse =
                regexOrFuncApply(noParse, webpack.module.noParse);
        }


    }
    const info = this.info || console.log;

    const pkg = require(cwd('package.json'));

    if (alias) {
        if (typeof alias === 'string') {
            alias = alias.split(/,\s*/);
        }
        if (Array.isArray(alias)) {
            webpack.resolve.alias =
                Object.assign({}, webpack.resolve.alias, resolveMap(...alias));

        } else {
            webpack.resolve.alias = Object.assign({}, webpack.resolve.alias,
                Object.keys(alias).reduce((ret, key) => {
                    ret[key] = enhancedResolve(alias[key]);
                    return ret;
                }, {}));
        }
    }

    if (!webpack.output) {
        webpack.output = {};
    }

    if (outputPath) {
        //webpack wants an absolute path here.
        webpack.output.path = enhancedResolve(outputPath);
    }

    demo = demo || app;

    if (this.isLibrary) {
        webpack.output.library       =
            typeof library == 'string' ? library : camelCased(pkg.name);
        webpack.output.libraryTarget = libraryTarget;
        //Don't hash when its a library
        webpack.output.filename      = filename.replace('[hash].', '');
    } else if (this.isDevServer) {
        //Don't hash when its running in devServer
        webpack.output.filename = filename.replace('[hash].', '');
    } else {
        webpack.output.filename = filename;
    }
    if (demo) {
        webpack.output.path = demo === true ? cwd('demo') : cwd(demo);
    }

    if (this.isDevServer || demo) {
        info('output filename', webpack.output.filename);
    }

    if (extensions) {
        if (!webpack.resolve.extensions) {
            webpack.resolve.extensions = [];
        }
        webpack.resolve.extensions.push(...extensions)
    }

    if (this.isLibrary && (useExternals !== false)) {

        let externals = [];
        if (Array.isArray(useExternals)) {
            externals = useExternals;
        } else if (typeof useExternals === 'string') {
            externals = useExternals.split(/,\s*/);
        }

        if (externalizePeers && pkg.peerDependencies) {
            externals = externals.concat(Object.keys(pkg.peerDependencies));
        }
        const wexternals  = webpack.externals || (webpack.externals = []);
        webpack.externals =
            wexternals.concat(Object.keys(externals.reduce((ret, key) => {
                ret[key] = key;
                return ret;
            }, {})));

        info('packaging as externalize', webpack.externals);
    }

    if (mainFields) {
        mainFields                 =
            typeof mainFields === 'string' ? mainFields.split(/,\s*/)
                                           : mainFields;
        mainFields                 =
            Array.isArray(mainFields) ? mainFields : mainFields === true
                                                     ? webpack.target == 'node'
                                                       ? ['source', 'main']
                                                       : SOURCE_MAIN_FIELDS
                                                     : DEFAULT_MAIN_FIELDS;
        webpack.resolve.mainFields = mainFields;
        info(`using mainFields`, mainFields);
    }
    if (node) {
        webpack.node = Object.assign({}, webpack.node, node);
        info('using node config %O', webpack.node);
    }

    webpack.devtool = devtool;

    return webpack;


};

module.exports = mod;

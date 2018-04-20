const { camelCased, cwd, resolveMap, enhancedResolve, regexOrFuncApply } = require(
    'mrbuilder-utils');
const DEFAULT_MAIN_FIELDS                                                = ['browser', 'main'];
const SOURCE_MAIN_FIELDS                                                 = ['source', 'browser', 'main'];

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
                          devtool = 'source-maps',
                          filename = '[name].[hash].js',
                          alias = [],
                          node,
                          noParse,
                          ...rest
                      }, webpack, om) {
    //If its not in
    if (Object.keys(rest).length > 0) {
        (this.info || console.log)(`Using a not explicitly supported webpack feature, 
        this will make your configuration bound to whatever version of webpack you are using. 
        mrbuilder will not be able to manage the version differences for you.
        
        The mrbuilder unsupported keys are ${Object.keys(rest)}
                
        `);
        Object.assign(webpack, rest);
    }
    if (mode) {
        webpack.mode = mode;
    }
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
    const output = webpack.output || (webpack.output = {});

    if (outputPath) {
        //webpack wants an absolute path here.
        output.path = enhancedResolve(outputPath);
    }

    demo = demo || app;

    if (this.isLibrary) {
        output.library       =
            typeof library === 'string' ? library : camelCased(pkg.name);
        output.libraryTarget = libraryTarget;
        //Don't hash when its a library
        output.filename      = filename.replace('[hash].', '');

        info(`building as library with name "${output.library}"`)

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

const { camelCased, cwd, resolveMap } = require('mrbuilder-utils');
const DEFAULT_MAIN_FIELDS             = ['browser', 'main'];
const SOURCE_MAIN_FIELDS              = ['source', 'browser', 'marin'];

const mod = function ({
                          library,
                          libraryTarget = 'commonjs2',
                          extensions = ['.js', '.jsx'],
                          mainFields = true,
                          app,
                          entry,
                          demo,
                          outputPath = cwd('lib'),
                          useExternals,
                          devtool = 'source-maps',
                          alias = [
                              'react',
                              'react-dom'
                          ]
                      },
                      webpack) {

    if (!webpack.resolve) {
        webpack.resolve = {
            alias: {}
        };
    }
    const info = this.info || console.log;

    const pkg = require(cwd('package.json'));

    if (alias) {
        if (typeof alias === 'string') {
            alias = alias.split(/,\s*/);
        }
        if (Array.isArray(alias)) {
            webpack.resolve.alias = Object.assign(webpack.resolve.alias,
                Array.isArray(alias) ? resolveMap(...alias) : alias
            );
        } else {
            webpack.alias = alias;
        }
    }

    if (!webpack.output) {
        webpack.output = {};
    }

    if (outputPath) {
        webpack.output.path = outputPath;
    }

    demo = app || demo;

    if (this.isLibrary) {
        webpack.output.library       =
            typeof library == 'string' ? library : camelCased(pkg.name);
        webpack.output.libraryTarget = libraryTarget;
    }


    if (!this.isDevServer && demo) {
        webpack.output.path     = demo === true ? cwd('demo') : cwd(demo);
        webpack.output.filename = '[name].[hash].js';
        info('using entry', webpack.output.path);
    } else {
        webpack.output.filename = '[name].js';
    }
    if (extensions) {
        webpack.resolve.extensions = extensions;
    }

    if (this.isLibrary && useExternals !== false) {
        if (Array.isArray(useExternals)) {
            webpack.useExternals = useExternals;
        } else if (typeof useExternals === 'string') {
            webpack.externals = useExternals.split(/,\s*/);
        } else {
            webpack.externals = Object.keys(pkg.peerDependencies || {});
        }
        info('packaging as externalize', webpack.externals);
    }

    if (mainFields) {
        mainFields                 =
            typeof mainFields === 'string' ? mainFields.split(/,\s*/)
                : mainFields;
        mainFields                 =
            Array.isArray(mainFields) ? mainFields : mainFields === true
                ? webpack.target == 'node' ? ['source', 'main']
                                                         : SOURCE_MAIN_FIELDS
                : DEFAULT_MAIN_FIELDS;
        webpack.resolve.mainFields = mainFields;
        info(`using mainFields`, mainFields);
    }

    webpack.devtool = devtool;

    return webpack;


};

module.exports = mod;

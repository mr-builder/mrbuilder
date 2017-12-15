const { camelCased, cwd, resolveMap } = require('mrbuilder-utils');
const DEFAULT_MAIN_FIELDS             = ['browser', 'main'];
const SOURCE_MAIN_FIELDS              = ['source', 'browser', 'marin'];
const { relative }                    = require('path');

const mod = function ({
                          library,
                          libraryTarget = 'umd',
                          extensions = ['.js', '.jsx'],
                          mainFields,
                          app,
                          entry,
                          demo,
                          outputPath = cwd('lib'),
                          useExternals,
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

    if (!(app || demo || this.isKarma || this.isDevServer)) {
        webpack.output.library       =
            typeof library == 'string' ? library : camelCased(pkg.name);
        webpack.output.libraryTarget = libraryTarget;
    }
    if (app) {
        this.useHtml            = true;
        webpack.entry.index     =
            !app || app === true ? cwd('public', 'index') : cwd(app);
        webpack.output.path     =
            !app || app === true ? cwd(outputPath) : cwd(app);
        webpack.output.filename = '[name].[hash].js';
        info('using app entry', webpack.entry.index);

    } else if (demo) {
        this.useHtml            = true;
        webpack.entry.index     =
            !demo || demo === true ? cwd('public', 'index') : demo;
        webpack.output.path     =
            demo === true ? cwd(outputPath) : cwd(demo);
        webpack.output.filename = '[name].[hash].js';
        info('using demo entry', webpack.entry.index);

    } else if (this.isDevServer) {
        this.useHtml        = true;
        webpack.entry.index =
            !demo || demo === true ? cwd('public', 'index') : demo;

        info('using dev server entry', webpack.entry.index);
    } else {
        webpack.output.filename = '[name].js';
    }
    if (extensions) {
        webpack.resolve.extensions = extensions;
    }

    if (useExternals || !this.useHtml) {
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
            Array.isArray(mainFields) ? mainFields : mainFieds === true
                ? SOURCE_MAIN_FIELDS : DEFAULT_MAIN_FIELDS;
        webpack.resolve.mainFields = mainFields;
        info(`using mainFields`, mainFields);
    }
    return webpack;


};

module.exports = mod;

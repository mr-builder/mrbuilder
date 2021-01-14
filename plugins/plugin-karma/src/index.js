const {pkg, cwd, enhancedResolve} = require('@mrbuilder/utils');
const {DefinePlugin, ContextReplacementPlugin} = require('webpack');
const processAlias = require('@mrbuilder/plugin-webpack/lib/processAlias').default;
const use = require('@mrbuilder/plugin-babel/use-babel');

module.exports = function ({
                               testDir,
                               pattern,
                               useCoverage = false,
                               pathinfo = true,
                               recursive = true,
                               node,
                               alias = {},
                               mainFields,
                               include,
                               test = pattern,
                           }, webpack, om) {

    pattern = pattern || test;
    const info = om.logger('@mrbuilder/plugin-karma').info;
    testDir = enhancedResolve(testDir);
    include = include.map(v => enhancedResolve(v));
    include.push(testDir);
    const packageJson = pkg();
    webpack.resolve.alias[packageJson.name] = cwd(packageJson.source || packageJson.main || 'src');

    processAlias(webpack, alias);

    if (om.enabled('@mrbuilder/plugin-babel')) {
        webpack.module.rules.unshift({
            test,
            include,
            type: 'javascript/auto',
            use: use(om),
        });
    }

    if (useCoverage) {
        info(`enabling code coverage for karma`);
        webpack.module.rules.unshift(
            {
                test,
                // instrument only testing sources with Istanbul
                include,
                type: 'javascript/auto',
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true,
                    },
                },
                enforce: 'post',
            },
        );
    }
    webpack.plugins.push(new ContextReplacementPlugin(/^@mrbuilder\/karma-test-context$/, testDir, recursive, pattern));

    //muck with webpack
    webpack.resolve.alias['@mrbuilder/karma-test-context'] = testDir;

    info('running tests in ', testDir);

    webpack.devtool = 'inline-source-map';
    webpack.target = 'web';
    webpack.node = webpack.node || {};
    Object.assign(webpack.node, node);
    webpack.output = {};
    webpack.output.pathinfo = pathinfo;
    //webpack.entry           = { test: testIndex };
    webpack.plugins.push(new DefinePlugin({MRBUILDER_TEST_MODULE: JSON.stringify(testDir)}));

    info('using test dir ', testDir);
    if (mainFields) {
        webpack.resolve.mainFields = mainFields;
    }
    webpack.externals = [];
    delete webpack.output.chunkFilename;
    return webpack;
};

const {pkg, cwd, enhancedResolve} = require('@mrbuilder/utils');
const {ContextReplacementPlugin}  = require('webpack');
const processAlias                = require('@mrbuilder/plugin-webpack/src/processAlias');
const use                         = require('@mrbuilder/plugin-babel/use-babel');
module.exports                    = function ({
                                                  testDir = cwd('test'),
                                                  pattern = /.*-test\.jsx?$/,
                                                  useCoverage = false,
                                                  pathinfo = true,
                                                  node = {
                                                      fs     : 'empty',
                                                      net    : 'empty',
                                                      console: false,
                                                      util   : true,
                                                  },
                                                  alias = {},
                                                  mainFields = ['source', 'browser', 'main'],
                                                  include = [cwd('src'), cwd('public')],

                                              }, webpack, om) {

    const info = (this.info || console.log);
    testDir    = enhancedResolve(testDir);
    include.push(testDir);
    const packageJson                       = pkg();
    webpack.resolve.alias[packageJson.name] = cwd(packageJson.source || packageJson.main || 'src');

    processAlias(webpack, alias);

    if (om.enabled('@mrbuilder/plugin-babel')) {
        webpack.module.rules.unshift({
            test: /\.[jte]sx?$/,
            include,
            use : use(om),
        });
    }

    if (useCoverage) {
        info(`enabling code coverage for karma`);
        webpack.module.rules.unshift(
            {
                test   : /\.[jet]sx?$/,
                // instrument only testing sources with Istanbul
                include,
                use    : {
                    loader : 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true,
                    },
                },
                enforce: 'post',
            },
        );
    }
    webpack.plugins.push(new ContextReplacementPlugin(/^@mrbuilder\/karma-test-context$/, pattern));

    //muck with webpack
    webpack.resolve.alias['@mrbuilder/karma-test-context'] = testDir;

    info('running tests in ', testDir);

    webpack.devtool = 'inline-source-map';
    webpack.target  = 'web';
    webpack.node    = webpack.node || {};
    Object.assign(webpack.node, node);
    webpack.output          = {};
    webpack.output.pathinfo = pathinfo;
    //webpack.entry           = { test: testIndex };
    this.useDefine          = Object.assign({}, this.useDefine, {
        MRBUILDER_TEST_MODULE: testDir,
    });
    (this.info || console.log)('using test dir ', testDir);
    if (mainFields) {
        webpack.resolve.mainFields = mainFields;
    }
    webpack.externals = [];
    delete webpack.output.chunkFilename;
    return webpack;
};

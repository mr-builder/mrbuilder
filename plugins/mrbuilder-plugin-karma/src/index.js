const { cwd }                                    = require('mrbuilder-utils');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const { resolve }                                = require('path');


module.exports = function ({
                               testDir = cwd('test'),
                               pattern = /.*-test\.jsx?$/,
                               useCoverage = false,
                               pathinfo = true,
                               node = {
                                   fs     : 'empty',
                                   net    : 'empty',
                                   console: false,
                                   util   : true
                               },
                               include = [cwd('src'), cwd('public')],
                               testIndex = resolve(__dirname, '..',
                                   'test-index.js')
                           }, webpack) {

    const info = (this.info || console.log);

    if (useCoverage) {
        info(`enabling code coverage for karma`);
        webpack.module.rules.unshift(
            {
                test   : /\.jsx?$/,
                // instrument only testing sources with Istanbul
                include,
                use    : {
                    loader : 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true
                    }
                },
                enforce: 'post',
            }
        );
    }
    webpack.plugins.push(new ContextReplacementPlugin(
        /^mrbuilder-karma-test-context$/, pattern));

    //muck with webpack
    webpack.resolve.alias['mrbuilder-karma-test-context'] = testDir;

    info('running tests in ', testDir);

    webpack.devtool = 'inline-source-map';
    webpack.target  = 'web';
    webpack.node    = webpack.node || {};
    Object.assign(webpack.node, node);
    webpack.output          = {};
    webpack.output.pathinfo = pathinfo;
    webpack.entry           = { test: testIndex };
    webpack.plugins.unshift(new DefinePlugin({
        MRBUILDER_TEST_MODULE: JSON.stringify(testDir)
    }));
    webpack.externals = [];
    return webpack;
};

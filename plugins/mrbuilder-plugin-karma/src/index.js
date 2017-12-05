const { cwd }                                    = require('mrbuilder-utils');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const { resolve, relative }                      = require('path');
const toRegex                                    = (val) => {
    if (val instanceof RegExp) {
        return val;
    }
    const parts = val.split(/^\/(.*)\/$/).slice(1);
    const re    = parts[0];
    const opt   = parts[1];
    if (opt) {
        return new RegExp(re, opt);
    }
    return new RegExp(re);
};

module.exports = function ({
                               testDir = cwd('test'),
                               pattern = /.*-test\.jsx?$/,
                               useCoverage = false,
                               pathinfo = true,
                               include = [cwd('src'), cwd('public')],
                               testIndex = resolve(__dirname, '..',
                                   'test-index.js')
                           }, webpack) {
    if (useCoverage) {
        console.warn(`enabling code coverage for karma`);
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
        /^mrbuilder-karma-test-context$/,
        toRegex(pattern)));

    //muck with webpack
    webpack.resolve.alias['mrbuilder-karma-test-context'] = testDir;

    console.warn('running tests in ', testDir);

    webpack.devtool = 'inline-source-map';
    webpack.target  = 'web';
    webpack.node    = webpack.node || {};
    Object.assign(webpack.node, {
        fs     : 'empty',
        net    : 'empty',
        console: false,
        util   : true
    });
    webpack.output          = {};
    webpack.output.pathinfo = pathinfo;
    webpack.entry           = { test: testIndex };
    webpack.plugins.unshift(new DefinePlugin({
        MRBUILDER_TEST_MODULE: JSON.stringify(testDir)
    }));

    return webpack;
};

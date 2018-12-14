const options = require('../babel-config');
const {cwd}   = require('mrbuilder-utils');

module.exports = ({
                      test,
                      include = [
                          cwd('src'),
                          cwd('public'),
                          /\/src\//,
                          /\/public\//,
                          /mrbuilder-plugin-html\/.*/
                      ],
                      use = {
                          loader: 'babel-loader',
                          options
                      },
                  }, webpack, om) => {
    const resolveLoader = webpack.resolveLoader || (webpack.resolveLoader = {});
    if (!resolveLoader.alias) {
        resolveLoader.alias = {};
    }
    resolveLoader.alias = Object.assign(resolveLoader.alias, {
        'babel-loader': require.resolve('babel-loader')
    });
    if (!test) {
        if (om.config('mrbuilder-plugin-typescript.useBabel')) {
            test = /\.[jet]sx?$/
        } else {
            test = /\.[je]sx?$/;
        }
    }

    webpack.module.rules.push({
        test,
        include,
        use,
    });
    return webpack;
};

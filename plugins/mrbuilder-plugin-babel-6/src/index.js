const options = require('../babel-config');
const {cwd}   = require('mrbuilder-utils');

module.exports = ({
                      test = /\.jsx?$/,
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
                  }, webpack) => {
    const resolveLoader = webpack.resolveLoader || (webpack.resolveLoader = {});
    resolveLoader.alias = Object.assign(resolveLoader.alias || {}, {
        'babel-loader': require.resolve('babel-loader')
    });

    webpack.module.rules.push({
        test,
        include,
        use,
    });
    return webpack;
};

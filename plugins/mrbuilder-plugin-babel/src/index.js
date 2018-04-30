const options     = require('../babel-config');
const { cwd }     = require('mrbuilder-utils');

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


    webpack.module.rules.push({
        test,
        include,
        use,
    });
    return webpack;
};

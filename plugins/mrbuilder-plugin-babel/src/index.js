const options     = require('../babel-config');
const { cwd }     = require('mrbuilder-utils');
const moduleRe    = /\/babel-preset-env\/|^(env|es2015)$|\/babe-preset-es2015\//;
const moduleCheck = (v) => moduleRe.test(v);

module.exports = ({
                      test = /\.jsx?$/,
                      include = [
                          cwd('test'),
                          cwd('src'),
                          cwd('public'),
                          /\/test\//,
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

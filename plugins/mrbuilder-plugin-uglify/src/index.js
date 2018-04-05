const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({
                      test = /\.jsx?$/,
                      parallel = true,
                      cache = true,
                      sourceMap = false,
                      extractComments = true,
                      uglifyOptions = {
                          ie8        : false,
                          ecma       : 8,
                          warn       : true,
                          global_defs: {
                              "@alert"   : "console.log",
                              DEBUG      : false,
                              PRODUCTION : true,
                              DEVELOPMENT: false,
                          },
                          compress   : {
                              dead_code  : true,
                              keep_fargs : false,
                              keep_fnames: false,
                          },
                          output     : {
                              comments: false,
                              beautify: false,
                          },
                      }
                  }, webpack) => {

    if (!webpack.optimization){
        webpack.optimization = {};
    }
    if (!webpack.optimization.minimizer){
        webpack.optimization.minimizer = [];
    }
    webpack.optimization.minimizer.push(new UglifyJsPlugin({
        test,
        parallel,
        cache,
        sourceMap,
        extractComments,
        uglifyOptions
    }));

    return webpack;
};

const {LoaderOptionsPlugin} = require('webpack');
module.exports = ({
                      test = /\.worker\.jsx?/,
                      use = ['worker-loader'],
                      filename = "[name].[hash].worker.js",
                      chunkFilename = "[id].[hash].worker.js"
                  }, webpack) => {
    webpack.module.rules.push({
        test,
        use
    });
    webpack.plugins.push(new LoaderOptionsPlugin({
        options: {
            worker: {
                output: {
                    filename,
                    chunkFilename
                }
            }
        }
    }));

    return webpack;
};

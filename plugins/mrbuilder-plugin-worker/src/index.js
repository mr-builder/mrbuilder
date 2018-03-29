const { LoaderOptionsPlugin } = require('webpack');
module.exports                = ({
                                     test = /\.worker\.jsx?$/,
                                     loader = 'worker-loader',
                                     filename = "[name].[hash].worker.js",
                                     chunkFilename = "[id].[hash].worker.js",
                                     publicPath = '/public/',
                                     inline = true,
                                     fallback = false,
                                 }, webpack) => {
    webpack.module.rules.push({
        test,
        use: {
            loader,
            options: {
                inline,
                fallback
            }
        }
    });
    //see https://github.com/webpack/webpack/issues/6642
    webpack.output.globalObject = "this";
    return webpack;
};

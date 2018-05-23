module.exports = function graphql({
                                      test = /\.(graphql|gql)$/,
                                      loader = 'graphql-tag/loader',
                                      exclude = /node_modules/,
                                      ...rest
                                  }={}, webpack) {

    webpack.plugins.loaders.push({
        test,
        exclude,
        loader,
        ...rest,
    });

    return webpack;
};
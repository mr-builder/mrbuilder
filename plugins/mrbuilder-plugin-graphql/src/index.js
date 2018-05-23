module.exports = function graphql({
                                      test = /\.(graphql|gql)$/,
                                      loader = 'graphql-tag/loader',
                                      exclude = /node_modules/,
                                      ...options
                                  } = {}, webpack) {

    webpack.module.rules.push({
        test,
        exclude,
        use: {
            loader,
            options,
        },
    });

    return webpack;
};
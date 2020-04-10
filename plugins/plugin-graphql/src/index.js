module.exports = function graphql({
                                      test,
                                      loader,
                                      exclude,
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

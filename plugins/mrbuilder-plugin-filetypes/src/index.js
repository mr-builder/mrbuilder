module.exports = ({
                      test = /\.(png|je?pg|gif?f|bmp|ppm|bpg|mpe?g)$/,
                      loader = 'file-loader',
                      limit = 1000,
                  }, webpack) => {

    webpack.module.rules.push({
        test,
        use: {
            loader,
            options: {
                limit,
            }
        }
    });

    return webpack;
};

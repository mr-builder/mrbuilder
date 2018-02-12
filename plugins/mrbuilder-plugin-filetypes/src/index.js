module.exports = ({
                      test = /\.(png|je?pg|gif?f|bmp|ppm|bpg|mpe?g)$/,
                      loader = 'file-loader',
                      options = {}
                  }, webpack) => {

    webpack.module.rules.push({
        test,
        use: {
            loader,
            options
        }
    });

    return webpack;
};

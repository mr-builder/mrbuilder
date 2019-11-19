module.exports = ({
                      test,
                      loader,
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

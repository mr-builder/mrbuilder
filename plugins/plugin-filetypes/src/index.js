import TYPES from './fileTypes';
module.exports = ({
                      test = TYPES,
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

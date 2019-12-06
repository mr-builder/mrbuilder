const useBabel = require('@mrbuilder/plugin-babel/use-babel');

module.exports = function ({
                               test,
                               include,
                               exclude,
                               ...options
                           } = {},
                           webpack, om) {

    webpack.module.rules.push({
        test,
        include,
        exclude,
        use: [
            useBabel(om),
            {
                loader: require.resolve('./markdown-loader'),
                options
            }]
    });
    return webpack;
}
;

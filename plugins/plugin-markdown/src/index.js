const useBabel = require('@mrbuilder/plugin-babel/use-babel');

module.exports = function ({
                               test,
                               include,
                               exclude,
                               ...options
                           } = {},
                           webpack, om) {
    Object.assign(webpack, {
        resolve: {
            ...webpack.resolve,
            extensions: [
                ...(webpack.resolve && webpack.resolve.extensions || []),
                '.md',
                '.mdx'
            ]
        }
    });
    webpack.module.rules.push({
        test,
        include,
        exclude,
        type: 'javascript/auto',
        use : [
            useBabel(om),
            {
                loader: require.resolve('./markdown-loader'),
                options
            }]
    });
    return webpack;
}
;

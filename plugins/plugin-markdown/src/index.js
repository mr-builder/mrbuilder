const useBabel = require('@mrbuilder/plugin-babel/use-babel');

module.exports = function ({
                               test = /\.mdx?$/,
                               include,
                               exclude,
                               fileExtensions = ['.md', '.mdx'],
                               ...options
                           } = {},
                           webpack, om) {
    Object.assign(webpack, {
        resolve: {
            ...webpack.resolve,
            extensions: [
                ...(webpack.resolve && webpack.resolve.extensions || []),
                ...fileExtensions
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

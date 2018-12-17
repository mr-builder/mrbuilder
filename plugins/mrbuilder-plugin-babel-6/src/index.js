/**
 * Babel 6 and 7 use different loaders.  So to keep it straight this code
 * goes here.
 * @param options
 * @param webpack
 * @returns {*}
 */
module.exports = (options, webpack) => {
    const resolveLoader = webpack.resolveLoader || (webpack.resolveLoader = {});
    if (!resolveLoader.alias) {
        resolveLoader.alias = {};
    }

    resolveLoader.alias = Object.assign(resolveLoader.alias, {
        'babel-loader': require.resolve('babel-loader')
    });
    return webpack;
};

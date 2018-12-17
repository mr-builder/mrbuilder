module.exports = (options, webpack) => {
    //no alias for custom loader.
    const resolveLoader = webpack.resolveLoader || (webpack.resolveLoader = {});
    if (!resolveLoader.alias) {
        resolveLoader.alias = {};
    }

    resolveLoader.alias = Object.assign(resolveLoader.alias, {
        'babel-loader': require.resolve('babel-loader')
    });

    return webpack;
};

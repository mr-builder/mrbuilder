module.exports = function (options, webpack) {


    webpack.resolve.alias['prop-types/checkPropTypes'] =
        require.resolve('prop-types/checkPropTypes');
    webpack.resolve.alias['prop-types-internal'] =
        require.resolve('prop-types');
    webpack.resolve.alias['prop-types']          =
        `${__dirname}/docWrapPropTypes`;
    return webpack;

};

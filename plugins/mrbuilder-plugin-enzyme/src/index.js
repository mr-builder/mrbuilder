/**
 * Sets up enzyme alias so that
 * everything uses same enzyme.
 *
 * @param options
 * @param webpack
 * @returns {*}
 */
module.exports = function (options, webpack) {
    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {}
    }
    webpack.resolve.alias.enzyme = require.resolve('./enzyme');

    webpack.resolve.alias['enzyme-internal'] = require.resolve('enzyme');

    return webpack;
};

module.exports = function (options, webpack) {
    webpack.resolve.alias.emeth = require.resolve('emeth');
    return webpack;
};

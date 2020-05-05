module.exports = (options, webpack, om) => {
    if (!webpack.resolve.alias['emotion']) {
        webpack.resolve.alias['emotion'] = require.resolve('emotion')
    }
    return webpack;
}
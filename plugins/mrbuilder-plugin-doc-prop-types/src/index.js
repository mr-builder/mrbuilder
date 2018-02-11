const babelrc  = require('mrbuilder-plugin-babel/babel-config')
module.exports = function (options, webpack) {
    const excludes = ['PropTypes', 'checkPropTypes'];

    webpack.resolve.alias['prop-types/checkPropTypes'] =
        require.resolve('prop-types/checkPropTypes');
    webpack.resolve.alias['prop-types-internal']       =
        require.resolve('prop-types');

    const test = webpack.resolve.alias['prop-types'] =
        require.resolve(`./generate`);

    webpack.module.rules.push({
        test,
        use: [{
            loader : 'babel-loader',
            options: babelrc
        }, {
            loader : 'val-loader',
            options: {
                keys: Object.keys(require('prop-types'))
                            .filter(v => !excludes.includes(v))
            }
        }]
    });
    return webpack;

};

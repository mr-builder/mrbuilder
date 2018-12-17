const useBabel = require('mrbuilder-plugin-babel/use-babel');
module.exports = function (options, webpack, om) {
    const excludes = ['PropTypes', 'checkPropTypes'];

    webpack.resolve.alias['prop-types/checkPropTypes'] = require.resolve('prop-types/checkPropTypes');
    webpack.resolve.alias['prop-types-internal']       = require.resolve('prop-types');
    const test                                         = webpack.resolve.alias['prop-types'] = require.resolve(`./generate`);

    webpack.module.rules.push({
        test,
        use: [useBabel(om), {
            loader : 'val-loader',
            options: {
                keys: Object.keys(require('prop-types'))
                    .filter(v => !excludes.includes(v))
            }
        }]
    });
    return webpack;

};

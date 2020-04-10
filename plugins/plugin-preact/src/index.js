const {enhancedResolve} = require( '@mrbuilder/utils');
const Webpack = require('webpack');
module.exports = ({useCompat, alias}, webpack, om) => {
    if (!useCompat) {
        om.info('not using preact compatibility mode')
        return webpack;
    }
    if (!alias) {
        return webpack
    }
    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (useCompat) {
        webpack.resolve.alias = Object.assign(webpack.resolve.alias, Object.entries(alias).reduce((ret, [k, v]) => {
            ret[k] = enhancedResolve(v, om.require);
            return ret;
        }, {}));
    }
    if (!webpack.plugins){
        webpack.plugins = [];
    }

    webpack.plugins.push(new Webpack.ProvidePlugin({
        h: ['preact', 'h'],
    }));

    return webpack;
};



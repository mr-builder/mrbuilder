const {enhancedResolve} = require( '@mrbuilder/utils');

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

    webpack.resolve.alias = Object.assign(webpack.resolve.alias, Object.entries(alias).reduce((ret, [k, v]) => {
        ret[k] = enhancedResolve(v, om.require);
        return ret;
    }, {}));

    return webpack;
};



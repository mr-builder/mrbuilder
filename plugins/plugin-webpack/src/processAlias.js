const {
          resolveMap,
          enhancedResolve,
      }        = require('@mrbuilder/utils');
module.exports = function (webpack, alias) {
    if (!alias) {
        return;
    }

    if (!webpack.resolve) {
        webpack.resolve = {};
    }
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }
    if (typeof alias === 'string') {
        alias = alias.split(/,\s*/);
    }
    if (Array.isArray(alias)) {
        return webpack.resolve.alias =
            Object.assign({}, webpack.resolve.alias, resolveMap(...alias));

    }
    return webpack.resolve.alias = Object.assign({}, webpack.resolve.alias, Object.keys(alias).reduce((ret, key) => {
        ret[key] = enhancedResolve(alias[key]);
        return ret;
    }, {}));
};

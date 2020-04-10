const {enhancedResolve} = require("@mrbuilder/utils");

module.exports = ({useCompat = true}, webpack) => {
    if (!webpack.resolve) {
        webpack.resolve = {};
    }

    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }

    Object.assign(webpack.resolve.alias, {
        "react": "preact/compat",
        "react-dom/test-utils": "test-utils",
        "react-dom": "preact/compat"
    });

    return webpack;
};



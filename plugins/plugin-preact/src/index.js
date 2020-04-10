
module.exports = ({alias}, webpack) => {
    if (!alias){
        return webpack
    }
    if (!webpack.resolve) {
        webpack.resolve = {};
    }

    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }

    Object.assign(webpack.resolve.alias, alias);

    return webpack;
};



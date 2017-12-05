const { camelCased } = require('mrbuilder-utils');
module.exports       = function ({library}, webpack) {

    const pkg = require(process.cwd + '/package.json');
    if (!webpack.output) {
        webpack.output.library = library || camelCased(pkg.name);
    }
    return webpack;
};

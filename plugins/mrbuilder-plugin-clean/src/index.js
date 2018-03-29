const CleanWebpackPlugin = require('clean-webpack-plugin');
const path               = require('path');
module.exports = function (options={}, webpack, om) {
    const paths = [];

    if (options.paths) {
        paths.push(...options.root);
    } else if (webpack.output && webpack.output.path) {
        if (webpack.output.path[0] === '/') {
            paths.push(webpack.output.path);
        } else {
            paths.push(path.join(process.cwd(), webpack.output.path))
        }
    } else if (this && this.outputPath) {
        paths.push(this.outputPath);
    }

    if (paths.length) {
        const cleanOptions = Object.assign({root:process.cwd()}, options);
        webpack.plugins.push(new CleanWebpackPlugin(paths, cleanOptions));
    } else {
        (this.warn || console.warn)(
            'no directory found not adding clean plugin');
    }
    return webpack;
};

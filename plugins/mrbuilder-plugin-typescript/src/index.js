const path                = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { existsSync }      = require('fs');

module.exports = function ({
                               test = /\.tsx?$/,
                               baseUrl = "./",
                               extensions = [".ts", ".tsx"],
                               configFile = path.join(__dirname,
                                   '..',
                                   'tsconfig.json')
                           },
                           webpack, om) {
    webpack.module.rules.push(
        {
            test,
            use: [
                'source-map-loader',
                'ts-loader',
            ]
        }
    );

    if (extensions) {
        if (!webpack.resolve.extensions) {
            webpack.resolve.extensions = [];
        }
        webpack.resolve.extensions.push(...extensions)
    }
    if (!existsSync(om.cwd('tsconfig.json'))) {
        if (configFile) {
            this.info(`using tsconfig ${configFile} with baseUrl ${baseUrl}`);
            webpack.plugins.unshift(
                new TsconfigPathsPlugin({ configFile, baseUrl, extensions, }));
        }
    } else {
        this.info('using local tsconfig.json');
    }
    return webpack;
};

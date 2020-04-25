const {enhancedResolve} = require( "@mrbuilder/utils");

const {DefinePlugin} = require('webpack');
const path = require('path');

module.exports = async ({sourceDir, test}, webpack, om) => {
    sourceDir = sourceDir || om.config('@mrbuilder/cli.sourceDir', path.join(process.cwd(), 'src'));
    if (!sourceDir.startsWith('/')){
        sourceDir = enhancedResolve(sourceDir);
    }
    if (!test) {
        if (om.enabled('@mrbuilder/plugin-typescript')) {
            test = "/\\.stories\\.[jet]sx?$/"

        } else {
            test = "/\\.stories\\.[je]sx?$/"
        }
    }
    webpack.plugins.push(new DefinePlugin({
        'MRBUILDER_PLUGIN_STORYBOOK_DIR': JSON.stringify(sourceDir),
        'MRBUILDER_PLUGIN_STORYBOOK_TEST': test + ''
    }));
    return webpack;
};
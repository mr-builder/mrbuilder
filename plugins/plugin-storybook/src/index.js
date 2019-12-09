const {DefinePlugin} = require('webpack');
const path = require('path');

module.exports = async ({sourceDir, matchPattern}, webpack, om) => {
    sourceDir = sourceDir || path.join(process.cwd(), 'src');
    if (!matchPattern){
        if (om.enabled('@mrbuilder/plugin-typescript')){
            matchPattern = "/\\.stories\\.[jet]sx?$/"

        }else {
            matchPattern = "/\\.stories\\.[je]s$/"
        }
    }
    webpack.plugins.push(new DefinePlugin({
        'MRBUILDER_PLUGIN_STORYBOOK_DIR': JSON.stringify(sourceDir),
        'MRBUILDER_PLUGIN_STORYBOOK_MATCH': matchPattern + ''
    }));
    return webpack;
};
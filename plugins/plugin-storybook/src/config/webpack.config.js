const resolveWebpack = require('@mrbuilder/plugin-webpack/src/resolveWebpack');
const om = require('@mrbuilder/cli').default;
module.exports = async ({config}) => {
    console.dir(config, {depth: null});
    const {entry: {...entry}, mode, output: {...output}} = config;
    const webpack = await resolveWebpack(config, {isLibrary: false}, null);
    webpack.entry = entry;
    webpack.output = output;
    webpack.mode = mode;
    delete webpack.externals;

    //So storybook has its own client side markdown thing.   if we are using mrbuilders, we will
    // remove it so that we can get generated markdown instead.
    if (om.enabled('@mrbuilder/plugin-markdown')) {
        om.logger('@mrbuilder/plugin-storybook').info('disabling storybooks markdown');
        const idx = webpack.module.rules.findIndex(({test, use: [raw] = []}) => {
            if (test && raw && test.source === '\\.md$' && /raw-loader/.test(raw.loader)) {
                return true;
            }
        });
        if (idx > -1) {
            webpack.module.rules.splice(idx, 1);
        }
    }
    return webpack;
}
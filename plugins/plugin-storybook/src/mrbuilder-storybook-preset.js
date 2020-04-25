const om = require('@mrbuilder/cli').default;
const fs = require('fs');
const {resolveWebpack} = require('@mrbuilder/plugin-webpack/lib/resolveWebpack');


async function webpack(config, options) {
    const {entry: {...entry}, mode, devServer, output: {...output}} = config;
    const webpack = await resolveWebpack(config, {isLibrary: false}, (c)=>c);
    webpack.entry = entry;
    webpack.output = output;
    webpack.mode = mode;
    //webpack.devServer = devServer;
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

    webpack.module.rules.unshift({
        test: require.resolve('./parameters.js'),
        use: [{
            loader: 'val-loader',
            options: om.config('@mrbuilder/plugin-storybook.parameters', {})
        }]
    });

    const customWebpack = om.cwd('.storybook', 'webpack.config.js');
    if (fs.existsSync(customWebpack)) {
        const f = require(customWebpack);
        if (f) {
            if (typeof f == 'function') {
                return f(webpack);
            }
            return f;
        }
    }
    return webpack;
}


async function managerEntries(entry = []) {
    debugger;
    const r = entry.concat(...om.config('@mrbuilder/plugin-storybook.addons', []).map(v => require.resolve(v)));
    const customAddons = om.cwd('.storybook', 'addons.js');
    if (fs.existsSync(customAddons)) {
        r.push(customAddons);
    }
    return r;
}

module.exports = {webpack, managerEntries};


const {enhancedResolve, asArray, logObject} = require("@mrbuilder/utils");
const {optionsManager, Info,dotExtensions} = require('@mrbuilder/cli');
const {resolveWebpack} = require('@mrbuilder/plugin-webpack/resolveWebpack');


const logger = optionsManager.logger('@mrbuilder/plugin-storybook');
const tryResolve = (file) => {
    try {
        optionsManager.require.resolve(file);
        return true;
    } catch (e) {
        return false;
    }
}

const removeIf = (arr, fn) => {
    const idx = arr.findIndex(fn);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    return arr;
}

async function webpackFinal(config) {
    logger.debug('webpackFinal init');
    logObject('from storybook', Info.isDebug, config);
    const {entry: {...entry}, mode, devServer, output: {...output}} = config;


    //So storybook has its own client side markdown thing.   if we are using mrbuilders, we will
    // remove it so that we can get generated markdown instead.
    if (optionsManager.enabled('@mrbuilder/plugin-markdown')) {
        optionsManager.debug('disabling storybook\'s markdown using our own');
        removeIf(config.module.rules, ({test, use: [raw] = []}) => (test && raw && test.source === '\\.md$' && /raw-loader/.test(raw.loader)));
    }
    if (optionsManager.enabled('@mrbuilder/plugin-babel')) {
        optionsManager.debug('disabling storybook\'s babel using our own');
        const oneOf = [];
        config.module.rules = config.module.rules.filter(v => {
            if (v.test && v.test.test && v.test.test('test.jsx')) {
                oneOf.push(v);
                return false;
            }
            return true;
        })
        config.module.rules.push({oneOf});
    }
    const webpack = await resolveWebpack(config, {isLibrary: false});

    webpack.entry = entry;
    webpack.output = output;
    webpack.mode = mode;
    webpack.resolve.extensions = dotExtensions;
    //webpack.devServer = devServer;
    delete webpack.externals;
    webpack.module.rules.unshift({
        test: require.resolve('./parameters.js'),
        use: [{
            loader: 'val-loader',
            options: optionsManager.config('@mrbuilder/plugin-storybook.parameters', {})
        }]
    });

    logger.debug('webpackFinal init ends');

    return webpack;
}


const addons = [
    ...(optionsManager.config('@mrbuilder/plugin-storybook.addons', []) || [])
        .map(v => enhancedResolve(v, optionsManager.require))
];

const customAddons = optionsManager.cwd('.storybook', 'addons.js');
if (tryResolve(customAddons)) {
    addons.push(customAddons);
}

const stories = [
    ...asArray(optionsManager.config('@mrbuilder/plugin-storybook.stories', []))
        .filter(Boolean).map(v => optionsManager.cwd(v))
]
const register = {
    entries: [require.resolve('./stories.js')],
    webpackFinal,
    addons,
    stories
};
module.exports = register;
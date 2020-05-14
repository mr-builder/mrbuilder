const {enhancedResolve, asArray, logObject} = require("@mrbuilder/utils");
const {optionsManager, Info} = require('@mrbuilder/cli');
const {resolveWebpack} = require('@mrbuilder/plugin-webpack/resolveWebpack');

const fs = require('fs');

const logger = optionsManager.logger('@mrbuilder/plugin-storybook');
const tryResolve = (file) => {
    try {
        optionsManager.require.resolve(file);
        return true;
    } catch (e) {
        return false;
    }
}
const oneOfRules = (config) => {
    const cssRule = config.module.rules.find((rule) => (
        rule.oneOf && Object.keys(rule).length === 1) &&
        rule.oneOf.some((rule) => `${rule.test}`.includes('\\.module\\.css')),
    );

    if (cssRule) {
        cssRule.test = /\.css$/;
    }

    config.module.rules = [{
        oneOf: [...config.module.rules],
    }];
    return config;
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
        removeIf(config.module.rules, ({test, exclude}) => test && test.test && test.test('stuff.mjs') && exclude && exclude.length);
    }
    const webpack = await resolveWebpack(config, {isLibrary: false});

    webpack.entry = entry;
    webpack.output = output;
    webpack.mode = mode;
    //webpack.devServer = devServer;
    delete webpack.externals;
    webpack.module.rules.unshift({
        test: require.resolve('./parameters.js'),
        use: [{
            loader: 'val-loader',
            options: optionsManager.config('@mrbuilder/plugin-storybook.parameters', {})
        }]
    });

    const customWebpack = optionsManager.cwd('.storybook', 'webpack.config.js');
    if (fs.existsSync(customWebpack)) {
        const f = require(customWebpack);
        if (f) {
            if (typeof f == 'function') {
                return f(webpack);
            }
            return f;
        }
    }
    logger.debug('webpackFinal init ends');

    return oneOfRules(webpack);
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
const {optionsManager} = require('@mrbuilder/cli');
const fs = require('fs');
const {resolveWebpack} = require('@mrbuilder/plugin-webpack/lib/resolveWebpack');
const logger = optionsManager.logger('@mrbuilder/plugin-storybook');
const {enhancedResolve} = require('@mrbuilder/utils');
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


async function webpackFinal(config) {
    logger.debug('webpackFinal init');
    const {entry: {...entry}, mode, devServer, output: {...output}} = config;
    const webpack = await resolveWebpack(config, {isLibrary: false}, (c) => c);
    webpack.entry = entry;
    webpack.output = output;
    webpack.mode = mode;
    //webpack.devServer = devServer;
    delete webpack.externals;

    //So storybook has its own client side markdown thing.   if we are using mrbuilders, we will
    // remove it so that we can get generated markdown instead.
    if (optionsManager.enabled('@mrbuilder/plugin-markdown')) {
        optionsManager.logger('@mrbuilder/plugin-storybook').info('disabling storybooks markdown');
        const idx = webpack.module.rules.findIndex(({test, use: [raw] = []}) => {
            if (test && raw && test.source === '\\.md$' && /raw-loader/.test(raw.loader)) {
                return true;
            }
        });
        if (idx > -1) {
            webpack.module.rules.splice(idx, 1);
        }
    }
    if (optionsManager.enabled('@mrbuilder/plugin-css')) {

    }
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
const register = {
    webpackFinal,
    addons,
};

const customMainFile = optionsManager.cwd('.storybook', 'main');
if (tryResolve(customMainFile)) {
    logger.debug('project main.js found', customMainFile);

    const customMain = require(customMainFile);
    Object.entries(customMain).forEach(([key, value]) => {
        if (typeof value === 'function') {
            const oValue = register[key];
            if (!oValue) {
                register[key] = value;
            } else {
                if (typeof oValue === 'function') {
                    register[key] = (c, o) => oValue(value(c, o), o);
                } else {
                    register[key] = [...oValue, ...value];
                }
            }
        }
    });
}
logger.debug('register', register);
module.exports = register;
const {enhancedResolve, asArray, logObject} = require('@mrbuilder/utils');
const {optionsManager, Info, dotExtensions} = require('@mrbuilder/cli');
const {resolveWebpack}                      = require('@mrbuilder/plugin-webpack/resolveWebpack');


const logger     = optionsManager.logger('@mrbuilder/plugin-storybook');
const tryResolve = (file) => {
    try {
        optionsManager.require.resolve(file);
        return true;
    } catch (e) {
        return false;
    }
};

const testIf = (v, value) => v.test ? v.test.test ? v.test.test(value) : typeof v.test === 'function' ? v.test(value) : false : false;

const removeIf = (arr, fn) => {
    const idx = fn && arr && typeof arr.findIndex === 'function' ? arr.findIndex(fn) : -1;
    if (idx > -1) {
        arr.splice(idx, 1);
    }
    return arr;
};
let initCount  = 0;

async function webpackFinal(config) {
    logger.debug('webpackFinal init', ++initCount);
    logObject('from storybook', Info.isDebug, config);
    const {entry: {...entry}, mode, devServer, output: {...output}} = config;


    //So storybook has its own client side markdown thing.   if we are using mrbuilders, we will
    // remove it so that we can get generated markdown instead.
    if (optionsManager.enabled('@mrbuilder/plugin-markdown')) {
        optionsManager.debug('disabling storybook\'s markdown using our own');
        removeIf(config.module.rules, ({test, use} = {use: []}) => {
            const loader = use && use[0] && use[0].loader;
            return loader && typeof test.test === 'function' && test.test('test.md') && /raw-loader/.test(loader);
        });

    }
    if (optionsManager.enabled('@mrbuilder/plugin-babel')) {
        optionsManager.debug('disabling storybook\'s babel using our own');
        const oneOf         = [];
        config.module.rules = config.module.rules.filter(v => {
            if (testIf(v, 'test.jsx')) {
                oneOf.push(v);
                return false;
            }
            return true;
        });
        config.module.rules.push({oneOf});
    }
    if (optionsManager.enabled('@mrbuilder/plugin-css')) {
        config.module.rules = config.module.rules.filter(v => !testIf(v, 'hello.css'));
    }
    const webpack = await resolveWebpack(config, {isLibrary: false});

    webpack.entry              = entry;
    webpack.output             = output;
    webpack.mode               = mode;
    webpack.resolve.extensions = dotExtensions;
    //webpack.devServer = devServer;
    delete webpack.externals;
    webpack.module.rules.unshift({
        test: require.resolve('./parameters.js'),
        use : [{
            loader : 'val-loader',
            options: optionsManager.config('@mrbuilder/plugin-storybook.parameters', {}),
        }],
    });

    logger.debug('webpackFinal init ends');

    return webpack;
}


const addons = [
    ...(optionsManager.config('@mrbuilder/plugin-storybook.addons', []) || [])
        .map(v => enhancedResolve(v, optionsManager.require)),
];

const customAddons = optionsManager.cwd('.storybook', 'addons.js');
if (tryResolve(customAddons)) {
    addons.push(customAddons);
}

module.exports = {
    entries: [],
    webpackFinal,
    addons,
    stories: [
        ...asArray(optionsManager.config('@mrbuilder/plugin-storybook.stories', []))
            .filter(Boolean).map(v => optionsManager.cwd(v)),
    ],
};
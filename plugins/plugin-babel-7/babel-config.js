const {logObject, requireFn, asArray} = require('@mrbuilder/utils');
const {merge, mergeBabelConf} = require('@mrbuilder/plugin-babel/util');
const {join} = require('path');
require('@mrbuilder/plugin-browserslist');

const {optionsManager, Info} = require('@mrbuilder/cli');
const logger = optionsManager.logger('@mrbuilder/plugin-babel');
const fs = require('fs');
const babelProcess = require('./babel-process');

//All configurations shoudl first check babel then babel-7.  Idea being that we may get to normalize babel stuff and not require configuration per version.
const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-babel-7.${key}`, optionsManager.config(`@mrbuilder/plugin-babel.${key}`, def));

const isPreset = pName => /^(?:@babel[/]preset|babel-preset)-/.test(Array.isArray(pName) ? pName[0] : pName);

const resolvePlugin = (pluginName, pluginPath) => {
    if (pluginPath.startsWith('.')) {
        return join(pluginName, pluginPath);
    } else if (pluginPath.startsWith('/')) {
        return pluginPath;
    }
    return pluginPath;
}

function initBabel(babelConf) {

    optionsManager.forEach(option => {
        const babelPlugin = option.get('@babel');
        if (!babelPlugin) {
            return;
        }
        logger.debug('configuring babel for %s', option.name);
        if (typeof babelPlugin === 'string') {
            babelConf = requireFn(resolvePlugin(option.name, babelPlugin)).call(option, option.get(), babelConf, optionsManager) || babelConf;
        } else if (Array.isArray(babelPlugin)) {
            mergeBabelConf(babelConf,(typeof babelPlugin[0] === 'string' ? [babelPlugin] : babelPlugin).reduce((ret, p) => {
                ret[isPreset(p) ? 'presets' : 'plugins'].push(p);
                return ret;
            }, {plugins: [], presets: []}));
        } else if (typeof babelPlugin === 'object') {
            mergeBabelConf(babelConf, babelPlugin);
        } else if (babelPlugin) {
            logger.warn(`unknown babel configuration '${babelPlugin}'`);
        }

    });
}

const babelrc = mrb('babelrc', true) ? optionsManager.cwd('.babelrc') : false;
let conf = mrb('config', {});

if (babelrc && fs.existsSync(babelrc)) {
    logger.info('using local .babelrc', babelrc);
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
} else {
    const defConf = mrb('babelConfig');
    if (defConf) {
        logger.debug('loading v7', defConf);
        conf = require(defConf);
    } else {
        conf = mrb('config', {});
    }
}

conf = conf || require('./package.json').mrbuilder.options.config || {};


conf.plugins = asArray(mrb('plugins', conf.plugins)) || [];
conf.presets = asArray(mrb('presets', conf.presets)) || [];

initBabel(conf);

if (conf.presets) {
    conf.presets = conf.presets.filter(Boolean);
}
if (conf.plugins) {
    conf.plugins = conf.plugins.filter(Boolean);
}
const babelConfig = babelProcess(conf, optionsManager.require.resolve);

logObject('babel configuration', Info.isDebug, babelConfig);

module.exports = babelConfig;

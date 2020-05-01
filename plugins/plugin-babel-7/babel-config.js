const {logObject, requireFn, asArray} = require('@mrbuilder/utils');
const {find, findPlugin, findPreset} = require('@mrbuilder/plugin-babel/util');
const {join} = require('path');
const {optionsManager, Info} = require('@mrbuilder/cli');
require('@mrbuilder/plugin-browserslist');
const logger = optionsManager.logger('@mrbuilder/plugin-babel');

const resolvePlugin = (pluginName, pluginPath)=>{
    if (pluginPath.startsWith('.')){
        return join(pluginName, pluginPath);
    }else if (pluginPath.startsWith('/')){
        return pluginPath;
    }
    return pluginPath;
}
function initBabel(babelConf) {
    const merge = (type, plugins) => {
        for (const [name, conf] of plugins.map(asArray)) {
            const bIdx = babelConf[type].findIndex(find(type, name));
            if (bIdx > -1) {
                babelConf[type][bIdx] = [name, conf];
            } else {
                babelConf[type].push([name, conf]);
            }
        }
    }

    optionsManager.forEach(option => {
        const babelPlugin = option.get('@babel');
        if (!babelPlugin) {
            return;
        }
        logger.debug('configuring babel for %s', option.name);
        if (typeof babelPlugin === 'string') {
            babelConf = requireFn(resolvePlugin(option.name, babelPlugin)).call(option, option.get(), babelConf, optionsManager) || babelConf;
        } else if (Array.isArray(babelPlugin)) {
            merge('plugins', babelPlugin);
        } else if (typeof babelPlugin === 'object') {
            const {plugins, presets, ...rest} = babelPlugin;
            merge('plugins', plugins);
            merge('presets', presets);
            Object.assign(babelConf, rest);
        } else if (babelPlugin) {
            logger.warn(`unknown babel configuration '${babelPlugin}'`);
        }

    });
}

const fs = require('fs');
const babelProcess = require('./babel-process');

//All configurations shoudl first check babel then babel-7.  Idea being that we may get to normalize babel stuff and not require configuration per version.
const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-babel-7.${key}`, optionsManager.config(`@mrbuilder/plugin-babel.${key}`, def));
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

let useModules = mrb('useModules');
if (useModules) {
    logger.info('allow exporting as ES6 modules');
    const idx = conf.presets.findIndex(findPreset('(?:env|2015)'));
    if (idx > -1) {
        let newMod = conf.presets[idx];
        const [mod, c = {}] = Array.isArray(newMod) ? newMod : [newMod];
        c.modules = false;
        conf.presets.splice(idx, 1, [mod, c])
    } else {
        conf.presets.push(['@babel/preset-env', {modules: false}])
    }
}


//Jest uses babel typescript plugin, so we detect that typescript and jest is in use, and we use it. All open to better
//ideas.


const useDecorators = mrb('useDecorators', 'legacy');
const decoratorsBeforeExport = mrb('decoratorsBeforeExport', false);
if (useDecorators) {
    let decIndex = conf.plugins.findIndex(findPlugin('proposal-decorators'));
    let classPropIdx = conf.plugins.findIndex(findPlugin('proposal-class-properties'));
    if (decIndex < 0) {
        decIndex = conf.plugins.push(['@babel/plugin-proposal-decorators', {decoratorsBeforeExport}]);
    }
    if (classPropIdx < 0) {
        classPropIdx = decIndex + 1;
        conf.plugins.splice(classPropIdx, 0, '@babel/plugin-proposal-class-properties');
    }
    if (useDecorators === 'legacy') {

        const decoratorOptions = {
            ...(Array.isArray(conf.plugins[decIndex]) && conf.plugins[decIndex][1]),
            legacy: true
        }
        //Does not work with legacy... can't even be there
        delete decoratorOptions.decoratorsBeforeExport;
        const dec = conf.plugins[decIndex] = ['@babel/plugin-proposal-decorators', decoratorOptions];

        const props = conf.plugins[classPropIdx] = ['@babel/plugin-proposal-class-properties', {
            ...(Array.isArray(conf.plugins[classPropIdx]) && conf.plugins[classPropIdx][1]),
            loose: true
        }];

        if (classPropIdx < decIndex) {
            conf.plugins[classPropIdx] = dec;
            conf.plugins[decIndex] = props;
        }
    } else {
        const decPlugin = asArray(conf.plugins[decIndex] || ['@babel/plugin-proposal-decorators', {}]);

        conf.plugins[decIndex] = [decPlugin[0],
            {
                decoratorsBeforeExport,
                ...(decPlugin[1])
            }
        ];
    }

}

initBabel(conf);

if (conf.presets) {
    conf.presets = conf.presets.filter(Boolean);
}
if (conf.plugins) {
    conf.plugins = conf.plugins.filter(Boolean);
}
const babelConfig = babelProcess(conf, optionsManager.require.resolve, mrb('coverage', false));
logger.debug('configuration');
logObject('babel configuration', Info.isDebug, babelConfig);
module.exports = babelConfig;
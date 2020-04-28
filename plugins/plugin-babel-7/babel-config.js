const optionsManager = require('@mrbuilder/cli').default;
require('@mrbuilder/plugin-browserslist');


const logger = optionsManager.logger('@mrbuilder/plugin-babel');
const enabled = (plugin) => optionsManager.enabled(`@mrbuilder/plugin-${plugin}`);


const fs = require('fs');
const babelProcess = require('./babel-process');
const {camelToHyphen} = require('@mrbuilder/utils');

const findPlugin = (name, type = 'plugin') => {
    const re = new RegExp(`^@babel\/(?:${type}-)?${name}$`);
    return function (v) {
        if (Array.isArray(v)) {
            return v[0] ? re.test(v[0]) : false;
        }
        return v ? re.test(v) : false;
    }
};
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


let _plugins = mrb('plugins');
if (_plugins) {
    if (_plugins === false) {
        conf.plugins = [];
    } else {
        conf.plugins = Array.isArray(_plugins) ? _plugins : [_plugins];
    }
}
let _presets = mrb('presets');
if (_presets != null) {
    if (_presets === false) {
        conf.presets = [];
    } else {
        conf.presets = Array.isArray(_presets) ? _presets : [_presets];
    }
}

if (!conf.plugins) {
    conf.plugins = [];
}
if (!conf.presets) {
    conf.presets = [];
}
if (optionsManager.config('@mrbuilder/plugin-react.useClassDisplayName', true)) {
    if (!conf.plugins.find(v => Array.isArray(v) ? v[0] === 'babel-plugin-add-react-displayname' : v === 'babel-plugin-add-react-displayname')) {
        conf.plugins.push('babel-plugin-add-react-displayname')
    }
}

const reactPropIdx = conf.presets.findIndex(findPlugin('react', 'preset'));

if (enabled('preact')) {
    const preact = {
        "pragma": "h",
        "pragmaFrag": "Fragment"
    }
    if (reactPropIdx > -1) {
        logger.info('using preact configuration');
        const r = Array.isArray(conf.presets[reactPropIdx]) ? conf.presets[reactPropIdx] : [conf.presets[reactPropIdx]];

        conf.presets[reactPropIdx] = [
            r[0],
            {
                ...r[1],
                ...preact,
            }
        ]
    } else {
        conf.presets.push(['@babel/preset-react', preact]);
    }
}

if (enabled('crank')) {
    if (reactPropIdx > -1) {
        conf.presets.splice(reactPropIdx, 1);
    }
    conf.presets.push('babel-preset-crank');
}

let useModules = mrb('useModules');
if (useModules) {
    logger.info('allow exporting as ES6 modules');
    const idx = conf.presets.findIndex(findPlugin('(?:env|2015)', 'preset'));
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
if (enabled('typescript')) {
    if (optionsManager.config('@mrbuilder/plugin-typescript.useBabel') ||
        enabled('jest') ||
        enabled('mocha')) {
        if (!conf.presets.some(findPlugin('typescript', 'preset'))) {
            conf.presets.push(['@babel/preset-typescript', {isTSX: true, allExtensions: true}]);
        }
    }
}

const useDecorators = mrb('useDecorators', 'legacy');
const decoratorsBeforeExport = mrb('decoratorsBeforeExport', true);
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

        const dec = conf.plugins[decIndex] = ['@babel/plugin-proposal-decorators', {
            ...(Array.isArray(conf.plugins[decIndex]) && conf.plugins[decIndex][1]),
            decoratorsBeforeExport,
            legacy: true
        }];

        const props = conf.plugins[classPropIdx] = ['@babel/plugin-proposal-class-properties', {
            ...(Array.isArray(conf.plugins[classPropIdx]) && conf.plugins[classPropIdx][1]),
            loose: true
        }];

        if (classPropIdx < decIndex) {
            conf.plugins[classPropIdx] = dec;
            conf.plugins[decIndex] = props;
        }
    } else {
        const decPlugin = Array.isArray(conf.plugins[decIndex]) ? conf.plugins[decIndex] : ['@babel/plugin-proposal-decorators', {}];

        conf.plugins[decIndex] = [decPlugin[0],
            {decoratorsBeforeExport, ...(decPlugin[1])}
        ];
    }

}

const applyConfig = (type) => (op) => {
    if (Array.isArray(op) ? op[1] === false : op.startsWith('-')) {
        return;
    }

    const preset = camelToHyphen(Array.isArray(op) ? op[0] : op);
    const short = (new RegExp(`/@babel/${type}-(${preset})/|^(${preset})$`).exec(preset));
    const conf = mrb(short[1] || short[2]);
    if (conf != null) {
        if (conf === false) {
            return;
        }
        return [preset, conf];
    }
    return op;
};
if (conf.presets) {
    conf.presets = conf.presets.map(applyConfig('preset')).filter(Boolean);
}
if (conf.plugins) {
    conf.plugins = conf.plugins.map(applyConfig('plugin')).filter(Boolean);
}
module.exports = babelProcess(conf, optionsManager.require.resolve, mrb('coverage', false));

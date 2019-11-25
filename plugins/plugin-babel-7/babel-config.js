const optionsManager = require('@mrbuilder/cli').default;
require('@mrbuilder/plugin-browserslist');


const logger = optionsManager.logger('@mrbuilder/plugin-babel');

const path = require('path');
const fs = require('fs');
const babelProcess = require('./babel-process');
const {camelToHyphen} = require('@mrbuilder/utils');
const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-babel.${key}`, def);
const babelrc = mrb('babelrc', true) ? path.resolve(process.cwd(), '.babelrc') : false;
let conf;
if (babelrc && fs.existsSync(babelrc)) {
    logger.info('using local .babelrc', babelrc);
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
} else {
    const defConf = mrb('babelConfig', `${__dirname}/babelrc.json`) || './babelrc.json';
    logger.debug('loading v7', defConf);
    conf = require(defConf);
}
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


let useModules = mrb('useModules');
if (useModules) {
    logger.info('allow exporting as ES6 modules');
    const envRe = /@babel\/(?:preset-)?(?:env|es2015)$/;
    const idx = conf.presets.findIndex(v => envRe.test(v));
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
if (optionsManager.enabled('@mrbuilder/plugin-typescript')) {
    if (optionsManager.config('@mrbuilder/plugin-typescript.useBabel') || optionsManager.enabled('@mrbuilder/plugin-jest')) {
        if (conf.presets.findIndex(v => /@babel\/(preset-?)typescript$/.test(v)) === -1) {
            conf.presets.push(['@babel/preset-typescript', {isTSX: true, allExtensions: true}]);
        }
    }
}

const applyConfig = (type) => (op) => {
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
/*if (mrb('hot') || optionsManager.enabled('@mrbuilder/plugin-hot')) {
    logger.info('using hot babel configuration');
    conf.plugins.push(require.resolve("react-hot-loader/babel"));
    useModules = true;
}*/

module.exports = babelProcess(conf, optionsManager.require.resolve, mrb('coverage', false));

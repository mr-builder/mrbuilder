const optionsManager = global._MRBUILDER_OPTIONS_MANAGER;

const logger = optionsManager.logger('mrbuilder-plugin-babel');

const mrb = (key, def) => optionsManager.config(
    `mrbuilder-plugin-babel.${key}`, def);


const path         = require('path');
const fs           = require('fs');
const babelProcess = require('./babel-process');
const babelrc      =
          mrb('babelrc', true) ? path.resolve(process.cwd(), '.babelrc')
              : false;
let conf;
if (babelrc && fs.existsSync(babelrc)) {
    logger.info('using local .babelrc', babelrc);
    conf = JSON.parse(fs.readFileSync(babelrc, 'utf8'));
} else {
    const defConf = mrb('babelConfig', `${__dirname}/babelrc.json`)
                    || './babelrc.json';
    logger.info('loading', optionsManager.enabled('mrbuilder-plugin-babel'),
        defConf);
    conf = require(defConf);
}

let useModules = mrb('useModules');
if (mrb('hot') || optionsManager.enabled('mrbuilder-plugin-hot')) {
    logger.info('using hot babel configuration');
    conf.plugins.unshift(require.resolve("react-hot-loader/babel"));
    useModules = true;
}
if (useModules) {
    logger.info('allow exporting as ES6 modules');
    const envRe = /\/babel-preset-env\/|^(env|es2015)$|\/babel-preset-es2015\//;
    const idx   = conf.presets.findIndex(v => envRe.test(v));
    if (idx > -1) {
        let newMod    = conf.presets[idx];
        const [mod, c = {}] = Array.isArray(newMod) ? newMod : [newMod];
        c.modules     = false;
        conf.presets.splice(idx, 1, [mod, c])
    } else {
        conf.presets.push(['babel-preset-env', { modules: false }])
    }
}

module.exports =
    babelProcess(conf, optionsManager.require.resolve, mrb('coverage', false));

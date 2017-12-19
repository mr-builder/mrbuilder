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
    const defConf = mrb('babelConfig', `${__dirname}/babelrc.json`) || './babelrc.json';
    logger.info('loading', optionsManager.enabled('mrbuilder-plugin-babel'), defConf);
    conf = require(defConf);
}

module.exports =
    babelProcess(conf, optionsManager.require.resolve, mrb('coverage', false));

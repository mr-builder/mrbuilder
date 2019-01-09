const path           = require('path');
const { existsSync } = require('fs');
const { cwd }        = require('@mrbuilder/utils');
module.exports       = function ({
                                     fix = true,
                                     include = [cwd('src')],
                                     test = /\.jsx?$/,
                                     exclude,
                                     enforce = 'pre',
                                     configFile = path.resolve(__dirname,
                                         'eslint.json')
                                 }, webpack) {
    const warn = this.warn || console.warn;
    const info = this.info || console.log;

    const loadConfig = () => {
        let localConfig = cwd('.eslint');
        if (existsSync(localConfig)) {
            try {
                info(`using local eslint`, localConfig);
                return localConfig;
            } catch (e) {
                warn('could not parse', e);
            }
        }
        return configFile;

    };
    if (fix) {
        warn('eslint fix is enabled, it may cause webpack to infinitely reload '
             + 'use "MRBUILDER_PLUGIN_ESLINT_FIX=0" to or '
             + '"--@mrbuilder/plugin-eslint-fix=0" disable')
    }
    const obj = {
        test,
        use: [{
            loader : "eslint-loader",
            options: {
                configFile: loadConfig(),
                fix
            }
        }]
    };
    if (enforce) {
        obj.enforce = enforce;
    }
    if (include) {
        obj.include = include;
    }
    if (exclude) {
        obj.exclude = exclude;
    }

    webpack.module.rules.push(obj);


    return webpack;
};

const {existsSync} = require('fs');
const {cwd} = require('@mrbuilder/utils');
const {enhancedResolve} = require('@mrbuilder/utils');
const {extensions} = require('@mrbuilder/cli');
module.exports = function ({
                               fix,
                               include,
                               test,
                               ext=extensions,
                               exclude,
                               cache,
                               formatter,
                               enforce,
                               configFile
                           }, webpack, om) {
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
        return require.resolve(enhancedResolve(configFile, om.require));
    };
    configFile = loadConfig();
    if (fix) {
        warn('eslint fix is enabled, it may cause webpack to infinitely reload '
            + 'use "MRBUILDER_PLUGIN_ESLINT_FIX=0" to or '
            + '"--@mrbuilder/plugin-eslint-fix=0" disable')
    }
    if (configFile.startsWith('@mrbuilder/plugin-eslint') && om.enabled('@mrbuilder/plugin-prettier')) {
        info('using "prettier" eslint settings');
    }
    const obj = {
        test: test ? test : ext ? v => (ext.some(e => ('.' + e.replace(/^[.]/, '')).endsWith(v))) : /\.jsx?$/,
        use: {
            loader: "eslint-loader",
            options: {
                configFile,
                fix,
                formatter,
                cache,
            }
        }
    };
    if (enforce) {
        obj.enforce = enforce;
    }
    if (include) {
        if (include == null) {
            include = [
                om.config('@mrbuilder/cli.sourceDir'),
                om.config('@mrbuilder/cli.testDir'),
            ]
        }
        obj.include = (Array.isArray(include) ? include : include ? [include] : []).map(v => enhancedResolve(v, om.require));
    }
    if (exclude) {
        obj.exclude = exclude;
    }

    webpack.module.rules.unshift(obj);


    return webpack;
};

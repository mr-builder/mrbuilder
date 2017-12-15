const path           = require('path');
const { existsSync } = require('fs');
const { cwd }        = require('mrbuilder-utils');

module.exports = function ({
                               fix = true,
                               configFile = path.resolve(__dirname,
                                   'eslint.json')
                           }, webpack) {
    const warn       = this.warn || console.warn;
    const info       = this.info || console.log;

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
             + '"--mrbuilder-plugin-eslint-fix=0" disable')
    }

    webpack.module.rules.unshift({
        enforce: "pre",
        test   : /\.jsx?$/,
        exclude: [/\/lib\//, /test-index\.js/, /node_modules/],
        loader : "eslint-loader",
        options: {
            configFile: loadConfig(),
            fix
        }
    });


    return webpack;
};

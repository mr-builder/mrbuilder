const { get } = require('@mrbuilder/utils');
/**
 * Mock Options manager allows you to relatively easily
 * get the behaviour for testing components, without all the initialization.
 *
 * @param configure
 * @returns {*}
 */
module.exports = function (configure = []) {
    configure = configure.map(v => Array.isArray(v) ? v : [v, {}]);
    const om  = {
        logger(plugin) {
            return {
                info(...args) {
                    console.log(`MOCK INFO[${plugin}]`, ...args);
                },
                warn(...args) {
                    console.log(`MOCK WARN[${plugin}]`, ...args);
                },
                debug(...args) {
                    console.log(`MOCK DEBUG[${plugin}]`, ...args);
                }
            }
        },

        config(name, def) {
            const parts = name.split('.', 2);
            const key   = parts.shift();
            if (!this.enabled(key)) {
                //if not enabled no default.
                return;
            }
            const config = this.plugins.get(key).config;
            const ret    = parts.length ? get(config, parts) : config;
            return ret == null ? def : ret;
        },
        enabled(name) {
            return !!this.plugins.get(name);
        },
        plugins: {
            get(plugin) {
                const config = configure.find(v => v[0] === plugin);
                if (!config) {
                    return;
                }
                return Object.assign({}, om.logger(plugin),
                    { config: config[1] });
            }
        },

    };
    return om;
};

const {cwd, enhancedResolve} = require('@mrbuilder/utils');
const {DefinePlugin} = require('webpack');
module.exports = function ({
                               variable,
                               version,
                               module = cwd('package.json'),
                               NODE_ENV = true
                           }, webpack) {
    if (!variable || !version) {
        const pkg = require(enhancedResolve(module));

        if (!version) {
            version = pkg.version;
        }
        if (!variable) {
            variable = pkg.name.toUpperCase().replace(/^@/, '').replace(/[^\w]{1,}/g, '_') + '_VERSION';
        }
    }

    if (!webpack.plugins) {
        webpack.plugins = [];
    }

    const conf = {
        [variable]: version
    };
    if (NODE_ENV) {
        if (NODE_ENV === true) {
            if (process.env.NODE_ENV) {
                NODE_ENV = process.env.NODE_ENV.toUpperCase();
            } else {
                if (this && this.mode) {
                    NODE_ENV = this.mode.toUpperCase();
                }
            }
        }
        conf[NODE_ENV] = 1;
    }
    const out = Object.entries(conf).reduce((ret, [key, value]) => {
        ret[key] = JSON.stringify(value);
        return ret;
    }, {});
    this.debug(JSON.stringify(out));
    webpack.plugins.unshift(new DefinePlugin(out));
    return webpack;
};

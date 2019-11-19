const {cwd, enhancedResolve} = require('@mrbuilder/utils');
module.exports = function ({
                               variable,
                               version,
                               module,
                               NODE_ENV = true
                           }) {
    if (!variable || !version) {
        const pkg = require(enhancedResolve(module || cwd('package.json')));

        if (!version) {
            version = pkg.version;
        }
        if (!variable) {
            variable = pkg.name.toUpperCase().replace(/^@/, '').replace(/[^\w]{1,}/g, '_') + '_VERSION';
        }
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
        conf['process.env.NODE_ENV'] = NODE_ENV.toLowerCase();
    }
    return Object.entries(conf).reduce((ret, [key, value]) => {
        ret[key] = JSON.stringify(value);
        return ret;
    }, {});

};

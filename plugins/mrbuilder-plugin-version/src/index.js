const { cwd }      = require('mrbuilder-util');
const DefinePlugin = require('webpack/lib/DefinePlugin');
module.exports     =
    function (webpack, {
        variable,
        version,
        NODE_ENV = true
    }) {
        if (!variable || !version) {
            const pkg = require(cwd('package.json'));

            if (!version) {
                version = pkg.version;
            }
            if (!variable) {
                variable =
                    pkg.name.toUpperCase().replace(/-+?/g, '_') + '_VERSION';
            }
        }

        if (!webpack.plugins) {
            webpack.plugins = [];
        }

        const conf = {
            [variable]: JSON.stringify(version)
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

        webpack.plugins.push(new DefinePlugin(conf))

    };

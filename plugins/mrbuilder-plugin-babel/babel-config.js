const version  = global._MRBUILDER_OPTIONS_MANAGER.config('mrbuilder-plugin-babel.babelVersion', '6');
module.exports = require(`mrbuilder-plugin-babel-${version}/babel-config`);

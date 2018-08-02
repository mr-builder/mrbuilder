/**
 * IntelliJ has webpack support for resolving aliases.  You can tell it to use this so that it can
 * resolve the alias's correctly.
 *
 */
const {enhancedResolve} = require('mrbuilder-utils');
const path              = require('path');
const OptionsManager    = require('mrbuilder-optionsmanager');
const mrbuilder         = global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER = new OptionsManager({
    prefix  : 'mrbuilder',
    _require: require,
}));
const alias             = mrbuilder.config('mrbuilder-plugin-webpack.alias');
module.exports = {
    context: path.join(process.cwd(), 'src'),
    resolve: {
        alias: Object.keys(alias).reduce(function (ret, key) {
            ret[key] = enhancedResolve(alias[key]);
            return ret;
        }, {})
    }
};


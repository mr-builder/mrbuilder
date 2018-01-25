#!/usr/bin/env node
if (!(process.env.NODE_ENV || process.env.MRBUILDER_NODE_ENV)) {
    process.env.NODE_ENV = 'production';
}
process.env.MRBUILDER_INTERNAL_PRESETS =
    [process.env.MRBUILDER_INTERNAL_PRESETS, 'mrbuilder'].join(',');
global._MRBUILDER_OPTIONS_MANAGER      =
    new (require('mrbuilder-optionsmanager').default)(
        { prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack/bin/cli');

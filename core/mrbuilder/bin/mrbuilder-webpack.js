#!/usr/bin/env -S MRBUILDER_INTERNAL_PRESETS=${MRBUILDER_INTERNAL_PRESETS},mrbuilder node
if (!(process.env.NODE_ENV || process.env.MRBUILDER_NODE_ENV)) {
    process.env.NODE_ENV = 'production';
}
global._MRBUILDER_OPTIONS_MANAGER      = global._MRBUILDER_OPTIONS_MANAGER || new (require('mrbuilder-optionsmanager').default)(
        { prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack/bin/cli');

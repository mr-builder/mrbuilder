#!/usr/bin/env -S MRBUILDER_INTERNAL_PRESETS=${MRBUILDER_INTERNAL_PRESETS},mrbuilder-preset-app NODE_ENV=development node
global._MRBUILDER_OPTIONS_MANAGER = global._MRBUILDER_OPTIONS_MANAGER  || new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack-dev-server/bin/cli');

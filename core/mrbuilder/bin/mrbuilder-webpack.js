#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PRESETS = [process.env.MRBUILDER_INTERNAL_PRESETS, 'mrbuilder'].join(',');
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack/bin/cli');

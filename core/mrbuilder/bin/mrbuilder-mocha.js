#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PRESETS = [process.env.MRBUILDER_INTERNAL_PRESETS, 'mrbuilder'].join(',');
global._MRBUILDER_OPTIONS_MANAGER = global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require }));
require('mrbuilder-plugin-mocha/bin/cli');

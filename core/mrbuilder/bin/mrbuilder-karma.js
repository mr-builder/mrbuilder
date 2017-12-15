#!/usr/bin/env  node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
console.log('what?',process.env.NODE_ENV)
process.env.MRBUILDER_INTERNAL_PRESETS = [process.env.MRBUILDER_INTERNAL_PRESETS, 'mrbuilder'].join(',');
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });

require('mrbuilder-plugin-karma/bin/mrbuilder-karma');

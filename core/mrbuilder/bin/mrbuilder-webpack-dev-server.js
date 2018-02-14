#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PRESETS=`${process.env.MRBUILDER_INTERNAL_PRESETS || ''},mrbuilder-preset-app`;
process.env.MRBUILDER_ENV = process.env.MRBUILDER_ENV || 'development';
global._MRBUILDER_OPTIONS_MANAGER = global._MRBUILDER_OPTIONS_MANAGER  || new (require('mrbuilder-optionsmanager'))({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack-dev-server/bin/cli');

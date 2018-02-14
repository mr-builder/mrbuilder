#!/usr/bin/env node
const {env} = process;
env.MRBUILDER_INTERNAL_PRESETS=`${env.MRBUILDER_INTERNAL_PRESETS || ''},mrbuilder-preset-app`;
env.MRBUILDER_ENV = env.MRBUILDER_ENV || 'development';
global._MRBUILDER_OPTIONS_MANAGER = global._MRBUILDER_OPTIONS_MANAGER  || new (require('mrbuilder-optionsmanager'))({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack-dev-server/bin/cli');

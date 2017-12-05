#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = [process.env.MRBUILDER_INTERNAL_PLUGINS,'mrbuilder'].join(',');
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-webpack-dev-server/bin/mrbuilder-webpack-dev-server');

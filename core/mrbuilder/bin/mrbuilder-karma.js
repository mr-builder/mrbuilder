#!/usr/bin/env -S MRBUILDER_INTERNAL_PRESETS=${MRBUILDER_INTERNAL_PRESETS},mrbuilder NODE_ENV=test node
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager'))({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-karma/bin/cli');

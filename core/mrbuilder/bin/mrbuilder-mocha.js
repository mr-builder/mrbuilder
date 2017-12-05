#!/usr/bin/env node
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-mocha/bin/mrbuilder-mocha');

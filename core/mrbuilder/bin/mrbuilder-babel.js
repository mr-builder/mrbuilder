#!/usr/bin/env -S MRBUILDER_INTERNAL_PLUGINS=${MRBUILDER_INTERNAL_PLUGINS},mrbuilder-plugin-babel node
global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({ prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-babel/bin/babel-cli');

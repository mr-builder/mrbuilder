#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS =
    `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},mrbuilder-plugin-babel`;
global._MRBUILDER_OPTIONS_MANAGER      =
    new (require('mrbuilder-optionsmanager'))(
        { prefix: 'mrbuilder', _require: require });
require('mrbuilder-plugin-babel/bin/babel-cli');

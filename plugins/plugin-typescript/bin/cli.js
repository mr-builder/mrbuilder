#!/usr/bin/env node
const optionsManager = global._MRBUILDER_OPTIONS_MANAGER ||
    (global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').default)({
        prefix: 'mrbuilder',
        _require: require
    }));

require('@mrbuilder/plugin-typescript/src/manageTsConfig')(optionsManager);
require('typescript/bin/tsc');

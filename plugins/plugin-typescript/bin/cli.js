#!/usr/bin/env node
const optionsManager = global._MRBUILDER_OPTIONS_MANAGER ||
    (global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').default)({
        prefix: 'mrbuilder',
        _require: require
    }));

require('@mrbuilder/plugin-typescript/src/manageTsConfig')(optionsManager);
if (!process.argv.includes('--outDir')) {
    process.argv.splice(2, 0, '--outDir', 'lib');
}
if (!process.argv.includes('--sourceRoot')) {
    process.argv.push('--sourceRoot', 'src')
}

require('typescript/bin/tsc');

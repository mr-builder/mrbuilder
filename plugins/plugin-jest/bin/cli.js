#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
let om;
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PRESETS = `${process.env.MRBUILDER_INTERNAL_PRESETS || ''},@mrbuilder/preset-lib,@mrbuilder/preset-test`;
    process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;
    om = global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').default)({
        prefix: 'mrbuilder',
        _require: require
    });
}

const fs = require('fs');
if (!(fs.existsSync(om.cwd('jest.config.js')) || require(om.cwd('package.json')).jest)) {
    const argv = process.argv;
    if (!(argv.includes('--config', 2) || argv.includes('-c', 2))) {
        argv.splice(2, 0, '--config', om.require.resolve('@mrbuilder/plugin-jest/src/jest.config.js'));
    }
}

return require('jest/bin/jest');

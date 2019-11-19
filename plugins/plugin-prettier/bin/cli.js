#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
let om;
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-prettier`;
    om = global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').default)({
        prefix: 'mrbuilder',
        _require: require
    });
}
const fs = require('fs');

const exists = (...files) => {
    for (let i = 0, l = files.length; i < l; i++) {
        if (fs.existsSync(om.cwd(files[i]))) {
            return true;
        }
    }
    return false;
};

const argv = process.argv;

if (!(exists('.prettierrc', 'prettier.config.js') || require(om.cwd('package.json')).prettier)) {
    if (!argv.includes('--config', 2)) {
        argv.splice(2, 0, '--config', om.require.resolve('@mrbuilder/plugin-prettier/src/prettier.config.js'));
    }
}
if (!(argv.includes('--write', 2) || argv.includes('--check', 2))) {
    argv.push('--write', '{src,test}/**');
}

return require('prettier/bin-prettier');

//(.prettierrc, package.json, prettier.config.js)
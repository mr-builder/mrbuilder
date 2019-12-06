#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-prettier`;

const om = require('@mrbuilder/cli').default;
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
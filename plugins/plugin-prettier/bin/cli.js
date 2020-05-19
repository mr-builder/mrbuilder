#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-prettier`;
if (!argv.includes('--config', 2)) {
    argv.splice(2, 0, '--config', require.resolve('@mrbuilder/plugin-prettier/src/prettier.config.js'));
}

if (!(argv.includes('--write', 2) || argv.includes('--check', 2))) {
    argv.push('--write', '{src,test}/**');
}

return require('prettier/bin-prettier');
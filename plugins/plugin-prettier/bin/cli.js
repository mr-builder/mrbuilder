#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-prettier,@mrbuilder/cli`;

const {optionsManager} = require('@mrbuilder/cli');
const {argv} = process;
const orig = argv.slice(2);
if (!orig.includes('--config')) {
    argv.splice(2, 0, '--config', require.resolve('@mrbuilder/plugin-prettier/src/prettier.config.js'));
}

if (!(orig.includes('--write') || orig.includes('--check'))) {
    if (optionsManager.config('@mrbuilder/plugin-prettier.write', true)) {
        argv.push('--write');
    }
}

if (orig.filter(v => !/^-/.test(v)).length == 0) {

    const files = optionsManager.config('@mrbuilder/plugin-prettier.files') || [];
    if (!files.length) {
        //gosh I know this bad.   But prettier does not give a lot of options.
        files.push(`${optionsManager.config('@mrbuilder/cli.sourceDir', 'src')}/**/!(*.styl|*.stylm)`)
        files.push(`${optionsManager.config('@mrbuilder/cli.testDir', 'test')}/**/!(*.styl|*.stylm)`)
        process.argv.push(...files);
    }
}

console.log('argv', process.argv);

require('prettier/bin-prettier');
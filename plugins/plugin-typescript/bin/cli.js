#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-typescript,@mrbuilder/cli`;
require('@mrbuilder/plugin-typescript/manageTsConfig')(require('@mrbuilder/cli').default);
if (!process.argv.includes('--outDir')) {
    process.argv.splice(2, 0, '--outDir', 'lib');
}
if (!process.argv.includes('--sourceRoot')) {
    process.argv.push('--sourceRoot', 'src')
}

require('typescript/bin/tsc');

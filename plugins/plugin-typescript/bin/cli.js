#!/usr/bin/env node
require('@mrbuilder/plugin-typescript/manageTsConfig')(require('@mrbuilder/cli').default);
if (!process.argv.includes('--outDir')) {
    process.argv.splice(2, 0, '--outDir', 'lib');
}
if (!process.argv.includes('--sourceRoot')) {
    process.argv.push('--sourceRoot', 'src')
}

require('typescript/bin/tsc');

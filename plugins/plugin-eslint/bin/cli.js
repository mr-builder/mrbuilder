const {enhancedResolve} = require('@mrbuilder/utils');
const {optionsManager} = require('@mrbuilder/cli');
const args = process.argv.slice(2);
if (!(args.includes('-c', 2) || args.includes('--config') || args.find((v) => v.startsWith('--config=')))) {
    const configFile = optionsManager.config('@mrbuilder/plugin-eslint.configFile');
    if (configFile) {
        process.argv.push('--config', enhancedResolve(configFile, optionsManager.require));
    }else{
        process.argv.push('--config', require.resolve('@mrbuilder/plugin-eslint/src/eslint'));
    }
}

if (!(args.find(v => /^--fix[=-]?$/.test(v)))) {
    if (optionsManager.config('@mrbuilder/plugin-eslint.fix')) {
        process.argv.push('--fix');
    }
}

require('eslint/bin/eslint');
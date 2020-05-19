const {enhancedResolve} = require('@mrbuilder/utils');
const {optionsManager} = require('@mrbuilder/cli');
const args = process.argv.slice(2);
if (!(args.includes('-c', 2) || args.includes('--config') || args.find((v) => v.startsWith('--config=')))) {
    const configFile = optionsManager.config('@mrbuilder/plugin-eslint.configFile');
    if (configFile) {
        process.argv.splice(2, 0, '--config', enhancedResolve(configFile, optionsManager.require));
    } else {
        process.argv.splice(2, 0, '--config', require.resolve('@mrbuilder/plugin-eslint/src/eslint'));
    }
}

if (!(args.find(v => /^--fix[=-]?$/.test(v)))) {
    if (optionsManager.config('@mrbuilder/plugin-eslint.fix')) {
        process.argv.splice(2, 0, '--fix');
    }
}

if (!(args.find(v => /^--ext([=].*)$/.test(v)))) {
    const ext = optionsManager.config(
        '@mrbuilder/plugin-eslint.ext',
        optionsManager.config('@mrbuilder/plugin-webpack.extensions')
    )
    if (ext) {
        process.argv.splice(2, 0, '--ext='+ext);
    }
}

process.argv.push(optionsManager.config('@mrbuilder/plugin-eslint.sourceDir', optionsManager.config('@mrbuilder/cli.sourceDir', 'src')));

require('eslint/bin/eslint');
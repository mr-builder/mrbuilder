const {optionsManager, Info} = require('@mrbuilder/cli');
const {logObject} = require('@mrbuilder/utils');
const isReact = optionsManager.enabled('@mrbuilder/plugin-react');
const isTypescript = optionsManager.enabled('@mrbuilder/plugin-typescript');
const isPrettier = optionsManager.enabled('@mrbuilder/plugin-prettier');

const config = {
    'parser': optionsManager.enabled('@mrbuilder/plugin-typescript') ? '@typescript-eslint/parser' : 'babel-eslint',
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 6,
        'allowImportExportEverywhere': true
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    'env': {
        'es6': true,
        'node': true,
        'mocha': true,
        'browser': true,
        'builtin': true
    },
    'globals': {
        'itShould': true,
        'expect': true,
        '__REACT_HOT_LOADER__': true
    },
    'extends': optionsManager.config('@mrbuilder/plugin-eslint.config', [
        isReact && 'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        isTypescript && 'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        isPrettier && (isReact ? "prettier/react" : "prettier/standard"),
        isPrettier && isTypescript && "prettier/@typescript-eslint"
    ]).filter(Boolean)
}

logObject("eslint config", Info.isDebug, config);
module.exports = config;
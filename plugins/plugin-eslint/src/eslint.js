const {optionsManager, Info} = require('@mrbuilder/cli');
const {logObject} = require('@mrbuilder/utils');
const isReact = optionsManager.enabled('@mrbuilder/plugin-react');
const isTypescript = optionsManager.enabled('@mrbuilder/plugin-typescript');
const isPrettier = optionsManager.enabled('@mrbuilder/plugin-prettier');
const mrb = (k, v) => optionsManager.config(`@mrbuilder/plugin-eslint${k ? `.${k}` : ''}`, v);
const settings = mrb('settings', {});
if (isReact) {
    if (!settings.react) {
        settings.react = {};
    }
    if (!settings.react.version) {
        settings.react.version = 'detect';
    }
}
const config = {
    'parser': mrb('parser', optionsManager.enabled('@mrbuilder/plugin-typescript') ? '@typescript-eslint/parser' : 'babel-eslint'),
    'plugins': mrb('plugins', []),
    'parserOptions': mrb('parserOptions', {
        'sourceType': 'module',
        'ecmaVersion': 6,
        'allowImportExportEverywhere': true
    }),
    settings,
    'env': mrb('env', {
        'es6': true,
        'node': true,
        'mocha': true,
        'browser': true,
        'builtin': true
    }),
    'globals': mrb('globals', {
        'itShould': true,
        'expect': true,
        '__REACT_HOT_LOADER__': true,

    }),
    'extends': [
        ...(mrb('extends', [])),
        isReact && 'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        isTypescript && 'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        isPrettier && (isReact ? "prettier/react" : "prettier/standard"),
        isPrettier && isTypescript && "prettier/@typescript-eslint",

    ].filter(Boolean),
    'overrides': mrb('overrides', []),
    'rules': mrb('rules', {}),
    'ignorePatterns': mrb('ignorePatterns', [])

}

logObject("eslint config", Info.isDebug, config);
module.exports = config;
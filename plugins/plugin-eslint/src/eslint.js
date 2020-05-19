const {optionsManager} = require('@mrbuilder/cli');
const isReact = optionsManager.enabled('@mrbuilder/plugin-react');
const isTypescript = optionsManager.enabled('@mrbuilder/plugin-typescript');
const isPrettier = optionsManager.enabled('@mrbuilder/plugin-prettier');

module.exports = {
    'parser': optionsManager.enabled('@mrbuilder/plugin-typescript') ? '@typescript-eslint/parser' : 'babel-eslint',
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 6,
        'allowImportExportEverywhere': true
    },
    'env': {
        'es6': true,
        'node': true,
        'mocha': true,
        'browser': true,
        'builtin': true
    },
    'globals': {
        'sinon': true,
        'itShould': true,
        'requiret': true,
        'requiref': true,
        'expect': true,
        '__REACT_HOT_LOADER__': true
    },
    'rules': {
        'block-scoped-var': 2,
        'camelcase': 2,
        'comma-style': [
            2,
            'last'
        ],
        'curly': [
            2,
            'all'
        ],
        'dot-notation': [
            2,
            {
                'allowKeywords': true
            }
        ],
        'eqeqeq': [
            2,
            'allow-null'
        ],
        'guard-for-in': 2,
        'key-spacing': 0,
        'new-cap': 0,
        'no-bitwise': 0,
        'no-caller': 2,
        'no-cond-assign': [
            2,
            'except-parens'
        ],
        'no-debugger': 2,
        'no-empty': 2,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-parens': [
            2,
            'functions'
        ],
        'no-irregular-whitespace': 2,
        'no-iterator': 2,
        'no-loop-func': 2,
        'no-multi-spaces': 0,
        'no-multi-str': 2,
        'no-new': 2,
        'no-plusplus': 0,
        'no-proto': 2,
        'no-script-url': 2,
        'no-sequences': 2,
        'no-shadow': 2,
        'no-undef': 2,
        'no-unused-expressions': 0,
        'no-unused-vars': 2,
        'no-underscore-dangle': 0,
        'no-with': 2,
        'quotes': [
            2,
            'single',
            'avoid-escape'
        ],
        'semi': [
            0,
            'never'
        ],
        'semi-spacing': 0,
        'strict': 0,
        'valid-typeof': 2,
        'wrap-iife': [
            2,
            'inside'
        ],
        'react/display-name': 1,
        'react/jsx-no-duplicate-props': 1,
        'react/jsx-no-undef': 1,
        'react/jsx-uses-react': 1,
        'react/jsx-uses-vars': 1,
        'react/no-danger': 1,
        'react/no-multi-comp': 1,
        'react/no-unknown-property': 1,
        'react/react-in-jsx-scope': 1,
        'react/self-closing-comp': 1,
        'react/jsx-wrap-multilines': 1
    },
    'extends': [
        isReact && 'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        isTypescript && 'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        isPrettier && isTypescript && 'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        isPrettier && 'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ]
}

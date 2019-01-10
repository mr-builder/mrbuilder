This plugin provides [eslint](https://eslint.org/) support to webpack to allow for linting of
your application during development. It uses the [eslint-loader](https://github.com/webpack-contrib/eslint-loader).


### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| configFile    | string     |              | Configuration file to use        |
| fix           | bool       | true         | Set eslint to fix errors         |
| include       | array      | $CWD/src     | Files to include in linting.     |
| exclude       | array      |              | Files to exclude                 |
| test          | regex      | /\.jsx?$/    | Files to match                   |
| enforce       | string     | pre          | Set enforce for this rule        |

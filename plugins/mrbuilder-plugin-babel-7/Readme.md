This plugin provides [babel 7](https://babeljs.io/) support to mrbuilder.   It allows for configuration
via .babelrc or via normal mrbuilder configuration methods. It also
provides support for babel to webpack via [babel-loader](https://github.com/babel/babel-loader)

The default babel configuration:

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "mrbuilder-plugin-babel/react-class-display-name",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-async-to-generator",
    [
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-export-namespace-from"
    ],
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions"
  ]
}

```


| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| hot           | bool       | false        | Turns hot loading supoprt for hmr usually automatically|
| test          | regex      | /\.jsx?$/    | Webpack module test to transpile |
| includes      | arrayOf: string,regex|./src,./public,./test| Webpack module includes option |
| use           | object     | {use:{loader:'babel-loader}}| Allows for a different babel-loader |
| <babel_plugin>| object     |              | configure babel plugins |



This plugin provides [Babel 6](https://babeljs.io/) support to mrbuilder.  The next major
 version will be defaulted to Babel 7 instead. Although support for babel 6 will continue for some time.
   
This plugin allows for configuration via .babelrc or via normal mrbuilder configuration methods. It also
provides support for babel to webpack via [babel-loader](https://github.com/babel/babel-loader)

The default babel configuration:

```json
{
  "presets": [
    "env",
    "react",
    "stage-2"
  ],
  "plugins": [
    "./react-class-display-name",
    "transform-function-bind",
    "transform-class-properties",
    "transform-async-to-generator",
    "transform-export-extensions",
    "transform-runtime"
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



This plugin provides [babel 7](https://babeljs.io/) support to mrbuilder.   It allows for configuration
via .babelrc or via normal mrbuilder configuration methods. It also
provides support for babel to webpack via [babel-loader](https://github.com/babel/babel-loader)

If your upgrading from babel 6 and have a custom .babelrc try running [babel-upgrade](https://github.com/babel/babel-upgrade)
to convert your .babelrc.   If your using mrbuilders defaults it should "just work".

The default babel configuration:



| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| hot           | bool       | false        | Turns hot loading supoprt for hmr usually automatically|
| test          | regex      | /\.jsx?$/    | Webpack module test to transpile |
| includes      | arrayOf: string,regex|./src,./public,./test| Webpack module includes option |
| use           | object     | {use:{loader:'babel-loader}}| Allows for a different babel-loader |
| <babel_plugin>| object     |              | configure babel plugins |
| useDecorators | bool or 'legacy'| legacy  | Use decorators. If its legacy class-properties   |


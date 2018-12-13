This plugin provides [babel](https://babeljs.io/) support to mrbuilder.   It allows for configuration
via .babelrc or via normal mrbuilder configuration methods. It also
provides support for babel to webpack via [babel-loader](https://github.com/babel/babel-loader)

The default babel configuration:


| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| babelVersion  | number     | 6            | Uses babel 6 or babel 7 |
| hot           | bool       | false        | Turns hot loading supoprt for hmr usually automatically|
| test          | regex      | /\.jsx?$/    | Webpack module test to transpile |
| includes      | arrayOf: string,regex|./src,./public,./test| Webpack module includes option |
| use           | object     | {use:{loader:'babel-loader}}| Allows for a different babel-loader |
| <babel_plugin>| object     |              | configure babel plugins |


To use Babel 7 will need to set the babelVersion to 7 and include the mrbuilder-plugin-babel-7 plugin in your configuration,
and you should exclude the mrbuilder-plugin-babel-6 while your at it

```json
{
  mrbuilder:{
    "plugins": [
      "mrbuilder-plugin-babel-7"
    ]
  }
}


```
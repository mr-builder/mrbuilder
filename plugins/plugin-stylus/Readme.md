This plugin provides [stylus](http://stylus-lang.com/) support for mrbuilder
using the [stylus-loader](https://github.com/shama/stylus-loader).  It also
adds [nib](https://tj.github.io/nib/) support.

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| alias         | object     |              | Add aliases                      |
| modules       | bool/regex | true         | Add css module support           |
| test          | regex      | /*.s[ac]ss$/ | match *.sass and scss files      |
| paths         | array      | node_modules | Add paths to include             |
| nib           | bool       | true         | use [nib](https://github.com/stylus/nib|
| includeCss    | bool       | true         | Include regular CSS on @import   |
| preferPathResolver | string|              | webpack or null                  |
| hoistAtRules  | bool       | true         | Move @import and @charset to the top|
| compress      | bool       | false        | Compress output                  |
| sourceMap     | bool       | true         | Output sourceMap                 |

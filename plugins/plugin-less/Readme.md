This plugin includes the webpack [less-loader](https://github.com/webpack-contrib/less-loader) and tries to smartly setup
less for css modules and regular less.

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| test          | regex      | /\.less$/    | Match files                      |
| options       | object     | strictMath,noIE| Options to pass to less-loader |

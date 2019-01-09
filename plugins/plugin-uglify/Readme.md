This plugin exposes configuration for uglification and minification.  It should
only be used in production builds. See [uglify-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) for more configuration
options.


Its default configuration is as follows
```js static
parallel = true,
cache = true,
sourceMap = false,
extractComments = true,
uglifyOptions = {
    ie8        : false,
    ecma       : 8,
    warn       : true,
    global_defs: {
        "@alert"   : "console.log",
        DEBUG      : false,
        PRODUCTION : true,
        DEVELOPMENT: false,
    },
    compress   : {
        dead_code  : true,
        keep_fargs : false,
        keep_fnames: false,
    },
    output     : {
        comments: false,
        beautify: false,
    },
}


```
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| parallel      | bool       | true         | Compress in parallel             |
| cache         | bool       | true         | Cache                            |
| ecma          | number     | 8            | ECMA level                       |
| global_defs   | object     | see above    | global definitions               |
| compress      | object     | see above    | compress options                 |
| output        | object     | see above    | output options                   |


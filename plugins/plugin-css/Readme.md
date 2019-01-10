This plugin provides css and css module support for mrbuider.  It also
supports webpack-extract-text-plugin and autoprefixer.


This plugin also exports a helper functions for other css like importers
such as less-loader and stylus loader.  Require  `mrbuilder-plugin-css/src/cssLoader`,
in new css loaders to allow for the same pipeline.  This allows css output
to be controlled by the css loader, while configuration of the loader is
handled by the webpack loader.

```js static
const cssLoader = require('mrbuilder-plugin-css/src/cssLoader');
module.exports = function(options, webpack){

    cssLoader(webpack, /*.sass$/, false, {
        loader:'sass-loader',
        options,
    });
    if (options.modules){
        cssLoader(webpack, /*.sassm$/, true, {
            loader:'sass-loader',
            options,
        });
    }

}

```

less -> autprefixer -> css-loader -> (extract-text or style-loader)

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| useStyleLoader| bool       | true         | Use extract text plugin          |
| publicPath    | string     | /public      | The public Path                  |
| modules       | bool or regex|false       | Support CSS Modules              |
| autoprefixer  | bool       | true         | Include autoprefixer support     |
| sourceMap     | bool       | true         | include sourcemap support        |
| localIdentName| string     | [hash]_[package-name]_[hyphen:base-name]_[local] | the localIdentName for css modules |


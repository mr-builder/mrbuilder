This plugin provides basic [file-loader](https://github.com/webpack-contrib/file-loader) support to webpack
The configuration is

*Note: svg is loaded by the mrbuilder-plugin-fonts.  Fonts require some special
 header to load correctly in some browsers.  If you add svg here and do not
 remove it from mrbuilder-plugin-fonts configuration, they will probably not work.

```js static
  test = /\.(png|je?pg|gif?f|bmp|ppm|bpg|mpe?g)$/,
  loader = 'file-loader',
  limit = 1000,
```
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| test          | regex      | /\.(png|je?pg|gif?f|bmp|ppm|bpg|mpe?g)$/ | Which files to use file loader |
| loader        | string     | file-loader  | what loader to use |
| options       | object     | {}           | options see file-loader docs |

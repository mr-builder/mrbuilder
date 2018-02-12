This plugin provides for font loading into webpack.

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| loader        | string     | url-loader   | What loader to use               |
| fontTypes     | array      | see below    | mimtype settings and loaders for fonts  |

```js static
[
 {

     test    : /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
     mimetype: 'application/font-woff',
 },
 {
     test    : /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
     mimetype: 'application/octet-stream'
 },
 {
     test  : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
     loader: 'file-loader',
 },
 {
     test    : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
     mimetype: 'image/svg+xml'
 }
]
```

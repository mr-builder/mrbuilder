
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| test          | String|RegExp|Array<String|RegExp>| *.js | What files to include     |
| include       | String|RegExp|Array<String|RegExp> | undefined | What files to include |  
| exclude       | String|RegExp|Array<String|RegExp> | undefined | What files to exclude |  
| cache         | Boolean|String| false     | Enable file caching |
| filename      | String     |[path].gz[query] | output filename               |
| algorithm     | String | zlib | Algorithm to use for compression |
| compressionOptions | object | { level: 9 } | Compression optoins to use |
| minRatio      |  Number     | 0.8 | Only assets that compress better than this ratio are processed | 
| deleteOriginalAssets | Boolean | false | Whether to delete the original assets or not. |

This provides enhanced chunk support to mrbuilder.


| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| filename      | string     | [name].[hash].js| The chunk filename            |
| manifest      | string     | manifest     | The 'manifest' chunk             |
| excludes      | arrayOf string            | modules to exclude from chunks   |
| crossOriginLoading|        |              | Configure cross origin loading   |
| cacheGroups   | object     | default group| The default chunkGroup           |
| styles         | string    | styles       | The default chunk for css        |
| splitChunks    | object    | {}           | the default splitChunks config   |


The default splitChunks looks as follows

```js static
{
  "chunks": "all",
  "minSize": 0,
  "maxAsyncRequests": null,
  "maxInitialRequests": null,
  "name": true
}

```

The default cacheGroups looks as follows

```json
 {
   "default": {
     "chunks": "async",
     "minSize": 30000,
     "minChunks": 2,
     "maxAsyncRequests": 5,
     "maxInitialRequests": 3,
     "priority": -20,
     "reuseExistingChunk": true
   }
 }
```
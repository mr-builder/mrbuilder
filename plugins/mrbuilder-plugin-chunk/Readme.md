This provides enhanced chunk support to mrbuilder.


| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| filename      | string     | [name].[hash].js| The chunk filename |
| manifest      | string     | manifest     | The 'manifest' chunk |
| excludes      | arrayOf string| | modules to exclude from chunks |
| crossOriginLoading| | | Configure cross origin loading|
| cacheGroups   | object     | ```json {
                                              default: {
                                                  chunks            : 'async',
                                                  minSize           : 30000,
                                                  minChunks         : 2,
                                                  maxAsyncRequests  : 5,
                                                  maxInitialRequests: 3,
                                                  priority          : -20,
                                                  reuseExistingChunk: true,
                                              }
                                          }``` | The default chunkGroup |


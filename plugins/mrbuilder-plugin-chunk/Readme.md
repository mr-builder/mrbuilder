This provides enhanced chunk support to mrbuilder.

/**
filename = '[name].[chunkhash].js',
                    manifest = 'manifest',
                    vendors = 'vendors',
                    excludes = [],
                    publicPath,
                    crossOriginLoading,


| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| filename      | string     | [name].[hash].js| The chunk filename |
| manifest      | string     | manifest     | The 'manifest' chunk |
| excludes      | arrayOf string| | modules to exclude from chunks |
| crossOriginLoading| | | Configure cross origin loading|

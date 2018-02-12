Turns on hot loading, and does a bit of magic to work correctly for
react apps.   Only use in development.

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| preEntry      | arrayOf(string)| ['react-hot-loader/patch'] | Hot loader patch|
| hot           | bool       | true         | Turn on hot loading              |
| inline        | bool       | true         | Inlining                         |

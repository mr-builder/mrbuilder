This provides [clean](https://github.com/johnagan/clean-webpack-plugin) functionality


NOTE -- This could do terrible things to your filesystem.  So please
have a backup and use carefullly.

## Paths
An [array] of string paths to clean

```js static
[
  'dist',         // removes 'dist' folder
  'build/*.*',    // removes all files in 'build' folder
  'web/*.js'      // removes all JavaScript files in 'web' folder
]
```

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| paths         | array      | outputPath   | The directories to clean         |
| root          | string     | $CWD         | The Root directory               |
| verbose       | bool       | false        | Be verbose                       |
| allowExternal | bool       | false        | Allow external directory deletion|
| dry           | bool       | false        | Dry run                          |

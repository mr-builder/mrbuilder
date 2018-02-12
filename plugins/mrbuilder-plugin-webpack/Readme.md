This plugin is a core plugin that provides the root of the [webpack](https://webpack.js.org) support.

### Options

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| libraryTarget | string     | commonjs2    | Type of library to output        |
| library       | string     |              | root library name                |
| mainFields    | bool or array|true        | Main fieds [source,browser,main] |
| app           | string     |              | Directory to build app (not library)|
| demo          | string     |              | Directory to build demo (not library)|
| entry         | object     | {index:src/index.js| Entry point                |
| outputPath    | string     | dist         | where to put built library       |
| useExternals  | bool       | true         | use externals                    |
| externals     | string     |              | libraries to use as externals    |
| externalizePeers|bool      | true         | Make peerDependencies external   |
| devtool       | string     | source-maps  | A dev tool                       |
| filename      | string     | [name].[hash].js|Name the javascript files      |
| alias         | array      | [react,react-dom]| Create alias's so only 1 version is used|

This plugin is a core plugin that provides the root of the [webpack](https://webpack.js.org) support.

### Options

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| libraryTarget | string     | commonjs2    | Type of library to output        |
| library       | string     |              | root library name                |
| mainFields    | bool | string[] | true        | Main fields [source,browser,main] |
| app           | string     |              | Directory to build app (not library)|
| demo          | string     |              | Directory to build demo (not library)|
| entry         | object     | {index:src/index.js}| Entry point                |
| outputPath    | string     | lib          | where to put built library       |
| useExternals  | bool       | true         | use externals                    |
| externals     | string     |              | libraries to use as externals    |
| externalizePeers|bool      | true         | Make peerDependencies external   |
| devtool       | string     | source-maps  | A dev tool                       |
| filename      | string     | [name].[hash].js|Name the javascript files      |
| alias         | string[]   | [react,react-dom]| Create alias's so only 1 version is used|
| node          | object     |              | Maps to [webpack.node](https://webpack.js.org/configuration/node/)             |
| extensions    | string[]   | [.js,.jsx,.json]| Add extensions (depreacted use cli.extensions) |
| public        | string     | ""           | The "publicPath" options in webpack|
| useTarget     | string     | "web"        | The target property in webpack     |
| noParse       | regex      |              | A pattern for webpack not to parse|
| globalThis    | string     |              | The object to use for global, 'this' works server and browser |

This plugin provides [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
 support for mbuilder projects.  This runs a convienent server for development.

You can pass in all the normal webpack devServer configuration.  In addition
it has a url rewrite functionality.

```js static
{
  "rewrite":{
    //rewrites
    "/public\/js\/(stuff)\.([a-z0-9A-Z])\.(js|css)/":"/whatever/{0}.{2}"
    //matches and sends back an empty string
    "/send_empty":true
  }
}
```

### Options
All other options are passed to webpack dev server.

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| historyApiFallback | bool  | true         | Use history fallback             |
| port          | number     | 8082         | Port to listen to                |
| contentBase   | string     | ./public     | Directory with assets            |
| entry         | object     | public/index.js| falls back to src/index.js     |
| rewrite       | object     |              | Rewrite urls                     |
| useBuildCache | bool       | false        | Enables build caching that can improve build performance|
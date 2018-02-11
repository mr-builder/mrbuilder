This plugin provides webpack-dev-server support for mbuilder projects.  This
runs a convienent server for development.

You can pass in all the normal webpack devServer configuration.  In addition
it has a url rewrite functionality.

```js
{
  "rewrite":{
    //rewrites
    "/public\/js\/(stuff)\.([a-z0-9A-Z])\.(js|css)/":"/whatever/{0}.{2}"
    //matches and sends back an empty string
    "/send_empty":true
  }
}
```

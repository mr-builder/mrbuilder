mrbuilder-plugin-webpack-dev-server
===
This plugin is designed to be used with [mrbuilder](https://github.com/jspears/mrbuilder).

## Installation
```sh
  $ yarn add "mrbuilder-plugin-webpack-dev-server" -D
```
## Configuration
In package.json
```json
{
 "name":"your_component"
 ...
 "mrbuilder":{
    "plugins":[
      "mrbuilder-plugin-webpack-dev-server"
    ]

 }
}
```

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

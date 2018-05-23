Mr Builder can be configured by command line arguments, environmental variables,
`package.json` and/or a `.mrbuiderrc`. This flexibilty allows for rapid testing
of various configuration, and ease of management.


### Configuration with package.json
To configure mrbuilder plugins with your `package.json`
add a "mrbuilder" property to your package.json with the configuration
as an object.

### Configuration with .mrbuilderrc
To configure mrbuilder plugins with your `.mrbuilderrc`
add a json file (comments are allowed) to your project.


### Configuration format.
The general mrbuilder configuration format has 3 keys, plugins,presets and env,
which can have plugins and presets.  The plugins and preset keys are arrays
that take either the plugin name or preset name respectively, or an array with
the first value being a string with the plugin name and the second argument either
an object to configure, or `false` to disable.



Example
```json
{
  "plugins": [
       "mrbuilder",
       "mrbuilder-plugin-env"
     ],
     "env": {
       "development": {
         "plugins": [
           [
             "mrbuilder-plugin-css",
             {
               "useNameHash": "css/[name].css"
             }
           ],
           "mrbuilder-plugin-html",
           "mrbuilder-plugin-webpack-dev-server",
           "mrbuilder-plugin-hot"
         ]
       },
       "production": {
         "plugins": [
           [
             "mrbuilder-plugin-css",
             {
               "useNameHash": "css/[name].[hash].css"
             }
           ],
           [
             "mrbuilder-plugin-webpack",
             {
               "app": "app",
               "filename": "js/[name].[hash].js",
               "externalizePeers": false
             }
           ],
           "mrbuilder-plugin-html",
           [
             "mrbuilder-plugin-chunk",
             {
               "filename": "js/[name].[hash].js"
             }
           ],
           "mrbuilder-plugin-uglify"
         ]
       }
     }
   }
}



```

### Configuring ENV
Which plugins and presets that are loaded can be configured via the environment
via the `MRBUILDER_INTERNAL_PLUGINS` and `MRBUILDER_INTERNAL_PRESETS` env variable.
This allows for plugins that are not explicitly defined in the package.json (or
.mrbuilderrc) to be loaded at runtime.  `MRBUILDER_ENV`is the "env" that you
want mrbuilder to run under i.e. "test","development","production".  By default
it is the same as the `NODE_ENV`, however you can have different values for each.

### Configuring Plugins.
Plugins can be configured either by `package.json`, `.mrbuilderrc`, command
line arguments or ENV variables.   The convention is to prefix the property
you would like to configure with the plugin name for command line arguments
and upper cased plugin name with hyphens converted to underscores for env variables. For command line arguments
either arguments can either have an = sign or a space to denote the value of
the argument; thought the = sign is the preferred syntax as values will not
be escaped by the shell.

Examples:
Command Line-
**Note** dashes after the plugin name will be converted to camelCase
```sh
$ mrbuilder --mrbuilder-plugin-webpack-app=demo
```
```sh
$ mrbuilder --mrbuilder-plugin-webpack-app demo
```

Environment-
*Note* underscores after the plugin name will be converted to camelCase.
```sh
$ MRBUILDER_PLUGIN_WEBPACK_APP=demo mrbuilder
```

Which is equivalent to in `.mrbuilderrc` or `package.json` configuration
```json
{
  "plugins":[
    ["mrbuilder-plugin-webpack", { "app":"demo"}]
  ]

}
```

### Load order
Plugins are only loaded once on application startup and the *first* plugin wins,
though it configuration can be changed via env, and or command line.  If you
wish to change a dependencies plugin configuration, include the plugin before
the dependency with its configuration.  First mrbuilder will load the configured
plugins for the current project, and than descend into the plugins and presets
for other configurations.

### env - configurations per environment.
Some plugins are only needed in test, or development, or production, or whatever.
To support this mrbuilder allows for an env section in `.mrbuilderrc` or `package.json`
to allow for plugin overrides.   If a plugin exists both in plugins and `env.current-env.plugins`
than the current-env plugins will be substituted in place.  Otherwise the env
plugins will be loaded after the plugins array has been loaded.

Example:

In the following example "mrbuilder-plugin-webpack" will be passed "app":demo by
default, but will be pass "app":"test" in the development env.  Also in the
development env, "mrbuilder-plugin-webpack-dev-server" will be added and the
less plugin will not be loaded.

```json

 "plugins":[
    ["mrbuilder-plugin-webpack", {"app":"demo"}]
    "mrbuilder-plugin-less"
 ],
 "env":{
    "development":{
        "plugins":[
            ["mrbuilder-plugin-webpack", {"app":"test"}],
            ["mrbuilder-plugin-less", false],
            "mrbuilder-plugin-webpack-dev-server"
        ]
    }
 }



```

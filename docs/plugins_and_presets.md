Plugins and presets are the main configuration methods of mrbuilder. They
may seem similar but have a few very important differences.

* plugins - are individual bits of functionality.
* presets - are collections of plugins, but itself has no functionality.  Plugins
            listed in a preset will be loaded, but a preset itself has no effect.


### Why Plugins and Presets?
Because sometimes you want to load a components configuration, but that component
is not a plugin.  In that case you could use the component as a "preset".  Also
if you want to have different groups of plugins configured together its convientent
to publish them as presets.



### Writing a plugin
The plugin api is relatively simple. Create a node module with a package.json,
 add a index.js and implement a function as below.  Where webpack is the webpack config.  Options
are the options passed into the plugin and optionsManager is the optionsManager
in case you need to check another plugin exists or configuration.  You can also return
a Promise that resolves to null or a webpack config.  Useful for plugins that need async
access to some server.

```js static
module.exports = function(options, webpack, optionsManager){
  //your magic here.
  return webpack
}

```

### env.MRBUILDER_INTERNAL_PRESETS
For build tools often you would like your tools configuration to be the fallback.  That is to
run after the other configurations have run.  For this `MRBUILDER_INTERNAL_PRESETS` exists. 
If you don't want your consumers to be able to change the configuration (only add plugins) you can
use `env.MRBUILDER_PRESETS`.  


### Configuring Babel
Plugins often have to extend the babel configuration.  To allow this to be configured per plugin,
you can add an '@babel' to your plugins configuration.  The right side, is either a string with the
name of the file of your code.  An array with a plugin and configuration, an array of plugins, or
a Babel configuration. Look at [plugin-typescript](https://github.com/mr-builder/mrbuilder/blob/master/plugins/plugin-typescript)
for an example. 

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
in case you need to check another plugin exists or configuration.

```js static
module.exports = function(options, webpack, optionsManager){
  //your magic here.
  return webpack
}

```

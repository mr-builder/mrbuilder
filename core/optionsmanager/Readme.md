The OptionsManager is a babel inspired configuration system for plugin based apps.
It is generic in the since it can be configured to use different namespaces.
It handles command line args, env args, and file based configuration.


## Theory
A method for enabling, discovering plugins is required in many apps, particularly in
mono repos, where there may be many many plugins.   This optionsmanager provides
infrastructure for describing the configuration and loading of said plugins.
Its meant to be declarative, to allow for easy modification and overriding.

It searches for a "plugins" or "presets" in a section named `${prefix}` in
package.json or `.${prefix}rc` in addition it searches the ENV for
`${envPrefix}_PLUGINS`, `${envPrefix}_PRESETS` and after evaluation it search
 `${envPrefix}_INTERNAL_PRESETS`


## Presets vs Plugins
All plugins within a preset will get the configuration.
Presets do not get evaluated only searched, so if a project needs
another projects presets the originating project can include it as
a preset.   As it is not a plugin ) but it uses
plugins this should add some convenience.

## Presets
Presets are a collection of configured plugins.   The follow the same env
resolution protocol as plugins


## ${envPrefix}_ENV -
Defaults to `NODE_ENV` if it is null.  This tells the option manager
which env the user, and therefore configuration the app is running with.
Because `NODE_ENV` is conventionally used for test,development,production,
but configurations often have more ENV's this allows for more specific
configuration for an environment.
I.E. a server build may be env `production:server` but the node env would
need to be production for downstream tools to work correctly.



## Configuration

```js static
const optionsManager = new OptionsManager({prefix:'whatever'});

```


 * prefix - the prefix to use for internal ie.[mrbuilder](https://github.com/jspears/mrbuilder)
 * envPrefix - the environment prefix to use, defaults to prefix.toUpperCase();
 * confPrefix - the prefix to configure things.
 * rcFile - the rc file to use for preferences, uses .${prefix}rc as default.
 * env - the environment default to process.env
 * argv - the arguments array defaults to process.argv;
 * cwd - A function returning current working dir defaults to process.cwd,
 * info - A function for logging info level console.info || console.warn,
 * debug - A function for logging debug level defaults console.info || console.warn,
 * warn - A function for logging warn level console.warn,
 * _require - A require function useful for scripts require,
 * aliasObj - Alias's you want to pass
 * handleNotFound - Function to call when a package is not found.


## Resolution
Plugins resolve from the plugins array first, than the env.ENV.plugins array.  If
a plugin exists in both arrays it will use the configuration of the env.ENV.plugins
array.  If no configuration is given for env.ENV.plugins than no configuration
will be passed to the plugin.  If a plugin in env.ENV.plugins second argument
is false than it will be disabled.

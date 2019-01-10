Mrbuilder 4.0 is using scoped modules under the @mrbuilder scope. 

Upgrading
===
To upgrade from the 3.x to 4.x you can run the [mrbuilder-upgrade](#@mrbuilder/upgrade) tool, see its read me for more
information. 

Changes
===
* mrbuilder-component-editor has been removed. It was half baked, and not sure anyone is using it.
* ENV variables are now processed before command line arguments.
* ENV variables can not be extended with _  for instance MRBUILDER_PLUGIN_BABEL_STUFF=1 is now 
  MRBUILDER_PLUGIN_BABEL={stuff:1}
* Command line arguments can not be extended with '-', but can be with '.'.  For example --mrbuilder-plugin-babel-stuff=1 is now --@mrbuilder/plugin-babel.stuff=1  
  This ensures that the correct arguments are set at the correct level.  For now --mrbuilder-plugin-something and --@mrbuilder/plugin-something are
  treated the same, but may change in next major version.
* Babel 7 is now the default.
* Packages have been renamed to use modules in the @mrbuilder scope.   This solves name spacing and trust issues.  Only
modules from @mrbuilder are from mrbuilder otherwise there are 3rd party modules.   Currently there are no differences in 
the behaviour but may be in the future

Fixes
===
* Command line arguments now support nested '.' syntax.
* Command line can now disable a plugin --@mrbuilder/plugin-stuff=false 
* Env can now disable a plugin MRBUILDER_PLUGIN_STUFF=0
* Fixes in react-hot-loader when a different version of the hot loader is installed.
* plugin-version now correctly removes all non word characters from variables.


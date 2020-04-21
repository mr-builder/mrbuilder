## Creating a new plugin
To create a new plugin here are some hints.


- Create a project
- Add a package.json
- add a main entry main=src in package.json
- create a main file usually src/index.js
- write a test in test/
- add mrbuilder as "dev" dependency.
- run tests


## Webpack Plugin API
If the plugin needs access to webpack  export a function, that function will be invoked with the first arugment
being webpack's configuration and the second the OptionsManager.   Here you can mutate the plugin as you wish.


## New CLI
If your plugin has a cli and is not just a webpack plugin.  Consider using the cli configuration 
mechansim to ensure the correct script is executed.  
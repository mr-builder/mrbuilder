These tools help develop mrbuilder, they could be used in other multimodule,
monorepos.   This is meant to hold all common dev dependencies.   This dependency
has all of the mrbuilder tools. You can use the plugins for more specific
tools.

## Autoinstall
Adding plugins to your project or running these commands, may cause them to
added as dep dependencies to your project.   This is a good thing, as now you
only have to add them in one place.   If you add the deps themselves then
it will not auto install.

## Upgrade from 0.x->1.2
The 'mrbuilder' package no longer ships with the dependencies.   Dependencies
will be added as you run commands.  That is calling mrbuilder-webpack will cause
the plugin to be installed.


## Configuration
The tools are designed to run with smart defaults.  Edit your 
package.json like this

```json
"scripts":{
 "karma": "mrbuilder-karma",
 //if you want plain moch use mrbuilder-mocha instead.
    "test": "mrbuilder-karma",
    "demo": "mrbuilder-webpack-demo",
    "server": "mrbuilder-webpack-dev-server",
    "prepublish": "mrbuilder-webpack",
    "clean": "rimraf ./lib ./dist"
},
"devDependencies":{
 "mrbuilder-plugin-support":"^2.2.3"
}
```

With this configuration you can run

* Tests:
```sh
$ yarn run test
```
* Karma:
```sh
$ yarn run karma

```
* Demo: 
```sh
$ yarn run demo
```
* Server: 
```sh
$ yarn run server
```


Included tools-
  * [mrbuilder-plugin-analyze](./plugins/mrbuilder-plugin-analyze)
  * [mrbuilder-plugin-babel](./plugins/mrbuilder-plugin-babel)
  * [mrbuilder-plugin-browserslist](./plugins/mrbuilder-plugin-browserslist)
  * [mrbuilder-plugin-css](./plugins/mrbuilder-plugin-css)
  * [mrbuilder-plugin-enzyme](./plugins/mrbuilder-plugin-enzyme)
  * [mrbuilder-plugin-eslint](./plugins/mrbuilder-plugin-eslint)
  * [mrbuilder-plugin-filetypes](./plugins/mrbuilder-plugin-filetypes)
  * [mrbuilder-plugin-fonts](./plugins/mrbuilder-plugin-fonts)
  * [mrbuilder-plugin-hot](./plugins/mrbuilder-plugin-hot)
  * [mrbuilder-plugin-html](./plugins/mrbuilder-plugin-html)
  * [mrbuilder-plugin-karma](./plugins/mrbuilder-plugin-karma)
  * [mrbuilder-plugin-less](./plugins/mrbuilder-plugin-less)
  * [mrbuilder-plugin-markdown](./plugins/mrbuilder-plugin-markdown)
  * [mrbuilder-plugin-mocha](./plugins/mrbuilder-plugin-mocha)
  * [mrbuilder-plugin-uglify](./plugins/mrbuilder-plugin-uglify)
  * [mrbuilder-plugin-webpack](./plugins/mrbuilder-plugin-webpack)
  * [mrbuilder-plugin-webpack-dev-server](./plugins/mrbuilder-plugin-webpack-dev-server)



## Babel
Mrbuilder uses babel to compile source code.  This command is for when you don't need webpack to do the compiling. The arguments are the same as [babel-cli](https://babeljs.io/docs/usage/cli/) but are defaulted to

```sh
$ mrbuilder-babel -s true &&\
 --out-dir lib &&\
 --copy-files &&\
```


## Webpack
This tool is designed to compile your code with webpack. It respects all the [webpack cli](https://webpack.js.org/api/cli/) but has been extended to be easier in multimodule projects.  Part of what
this does is creates alias to make debugging and changing multiple modules easier in dev mode and compile and biuld modes.


### Custom Webpack Configuration
Sometimes you need to change webpacks configuration.   [mrbuilder-webpack](#mrbuilder-plugin-webpack)
extends normal webpack behaviour to look into the dependencies and the current project for a `babel-config.js`
if this file exists it attempts to load it.   this file differs from traditional webpack as that
it is expected to be a function 


```js static
module.export = function(options,webpack, optionsManager){
  // options - are just for passing meta data to other loaders and from other loaders.
  // webpack is the actual configuration.  You can do whatever.
  // The optionsManager currently running.
  return webpack.
}

```
If you want or don't want different modules loaded by webpack, it looks in package.json
for include/exclude array of globs

package.json

```json 
{
  "mrbuilder":{
     "plugins":["your_plugins"],
  }
}
```



## Mocha
For non browser testing we use plain mocha. Its faster and easier to run than Karma but can not do browsery things. It uses the same babel configuration as mrbuilder-babel. It uses a combination of environmental variables and arguments for configuration, though typically it takes neither.

## Karma
Karma testing is useful for testing in browser.  This configuration
uses the aformentioned webpack with the following additional settings.





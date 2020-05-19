These tools help develop mrbuilder, they could be used in other multimodule,
monorepos.   This is meant to hold all common dev dependencies.   This dependency
has all of the mrbuilder tools. You can use the plugins for more specific
tools.

## Autoinstall
Adding plugins to your project or running these commands, may cause them to
added as dep dependencies to your project.   This is a good thing, as now you
only have to add them in one place.   If you add the deps themselves then
it will not auto install.

## Configuration
The tools are designed to run with smart defaults.  Edit your 
package.json like this

```json
"scripts":{
 "karma": "mrbuilder",
 //if you want plain moch use mrbuilder-mocha instead.
    "test": "mrbuilder",
    "demo": "mrbuilder",
    "app":"mrbuilder",
    "server": "mrbuilder",
    //use "babel":"mrbuilder", to only run babel instead of webpack
    "prepublish": "mrbuilder",
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
  return webpack
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

### Configuring the @mrbuilder/cli.
If you need to create a configuration for the cli.  You can 3 properties.
 argv - arguments to pass to your script, an array of strings.
 bin  - a node script to execute.
 env  - an object that will put the key and value in process.env.
 


MR Builder is meant to be used in a mono repo such as those supported by [lerna](https://lernajs.io/)
although this is not required nor a dependency.  Large projects are often broken
into smaller units that require versioning, dependencies and documentation, often
managing these smaller units is requires substatial time and investment in tooling
and fiddling.  MR Builder attempts to solve this by creating a plugin system
that allows for individual modules, to be created and published without separate
build configuration, although it does allow per module configuration when a module
deviates from the common build configuration.   Within a multi module system
it may make sence to have a module that holds said common configuration.


### Creating a multi module monorepo.
There is not much special about creating a monorepo, and there are many many
different ways to arrange them.  But generally a mrbuilder monorepository would
look as follows

```sh
# ${your_repository}
# ${your_repository}/${your}-builder
# ${your_repository}/${your}-builder/package.json
# ${your_repository}/components/...

```

### Your build tool.
The first step is creating your build tool.   Yes, I know mrbuilder is your build
tool, but by wrapping it in your own build tool, you allow for central configuration,
dependency versions and therefore it is suggested you start with one

```sh
# ${your_repository}
# ${your_repository}/${your}-builder
# ${your_reposotory}/${your}-builder/package.json
```
In this package.json add the dependency for mrbuilder

```sh
# yarn add mrbuilder
```

Then add the scripts into your bin section to your `package.json` A typical
react module system would look like.
```json
{
  "name":"{your_builder}",
  "version":"0.0.1",
  ...
  "bin":{
        "{your_builder}-babel": "bin/mrbuilder-babel.js",
        "{your_builder}-clean": "bin/mrbuilder-clean.js",
        "{your_builder}-karma": "bin/mrbuilder-karma.js",
        "{your_builder}-mocha": "bin/mrbuilder-mocha.js",
        "{your_builder}-webpack": "bin/mrbuilder-webpack.js",
        "{your_builder}-demo": "bin/mrbuilder-demo.js",
        "{your_builder}-webpack-dev-server"
  },
  "mrbuilder":{
    "plugins":["mrbuilder"//whatever else plugins you need]
  }
}
```


Each of your components should have a `package.json` within them describing
there name,version, description and mrbuilder configuration

### Your Components
Each of your components should have a dependency to {your}_builder and
scripts set to run

```json
{
    "name":"{your_component_name}",
    ...
    "devDependencies":{
        "{your_builder}":"0.0.1"
    },
    "scripts":{
        "start":"{your_builder}-demo",
        "build":"{your_builder}-webpack",
        "clean":"{your_builder}-clean",
        "test":"{your_builder}-karma",
        "prepublish":"yarn run clean && yarn run build && yarn run test"
    }
}

```

If you are using lerna, then you will be able to use its
```sh
 $ lerna run build
 $ lerna run test

```
Commands to run against all the modules in your project

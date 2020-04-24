

MR Builder is meant to be used in a mono repo such as those supported by [lerna](https://lernajs.io/)
although this is not required nor a dependency.  Large projects are often broken
into smaller units that require versioning, dependencies and documentation, often
managing these smaller units is requires substatial time and investment in tooling
and fiddling.  MR Builder attempts to solve this by creating a plugin system
that allows for individual modules, to be created and published without separate
build configuration, although it does allow per module configuration when a module
deviates from the common build configuration.   Within a multi module system
it may make sence to have a module that holds said common configuration.

### Just a module
While MR Builder is designed for use in monorepos.  It can also be used stand alone
Just add mrbuilder to your package.json and the scripts section.

```sh
 $ yarn add @mrbuilder/cli

```
And then edit package.json
```json
{
  "name":"your-component",
  "devDependencies":{
     "@mrbuilder/cli":"^4.0.0"
  },
  "main":"lib",
  "source":"src",
  "scripts":{
      "test":"mrbuilder",
      "karma":"mrbuilder",
      "prepublish":"mrbuilder",
      "start":"mrbuilder"
  }
}

```

Add a file to src/index.js with your react app and

```sh
 $ yarn run start
```


You can still configure .mrbuilderrc or add a mrbuilder property to the
root of our package.json.

As of 1.10 mrbuilder will auto install any plugin that is not defined in the
package.json.   To disable set the env `MRBUILDER_NO_AUTOINSTALL=1`.




### Creating a multi module monorepo.
There is not much special about creating a monorepo, and there are many,many,
different ways to arrange them.  However generally a  monorepo would
look as follows:

```sh
# {your_repository}
# {your_repository}/{your-builder}
# {your_repository}/{your-builder}/package.json
# {your_repository}/packages/...

```

### Your build tool.
The first step is creating your build tool.   Yes, I know mrbuilder is your build
tool, but by wrapping it in your own build tool, you allow for central configuration,
dependency versions and therefore it is suggested you start with one

```sh
# {your_reposotory}/{your_builder}/
```
In this package.json add the dependency for mrbuilder

```sh
# yarn init 
# yarn add @mrbuilder/cli
```

Then add the scripts into your bin section to your `package.json` A typical
react module system would look like.
```json
{
  "name":"{your_builder}",
  "version":"0.0.1",
  ...
  "bin":{
        "{your_builder}": "./bin/{your_builder}.js"
  },
  "mrbuilder":{
    "plugins":["@mrbuilder/cli"/*whatever else plugins you need*/]
  }
}
```

Now create a script in `{your_repository}/{your_builder}/bin/{your_builder}.js`

```js static
#!/usr/bin/env  node
process.env.MRBUILDER_PRESETS = '{your_builder}';
require('@mrbuilder/cli/bin/mrbuilder');
```

And make sure it is executable
```sh
$ chmod +x {your_repository}/{your_builder}/bin/{your_builder}.js
```
And do an install for good measure

```sh
$ yarn install
```


Each of your components should have a `package.json` within them describing
there name,version, description and mrbuilder configuration

### Your Components
Each of your components should have a dependency to {your_builder} and
scripts set to run

```json
{
    "name":"{your_component_name}",
    ...
    "devDependencies":{
        "{your_builder}":"0.0.1"
    },
    "scripts":{
        "start":"{your_builder}",
        "build":"{your_builder}",
        "prepare":"{your_builder}",
        "test":"{your_builder}"
    }
}

```

If you are using Lerna, then you will be able to use its
```sh
 $ lerna run build
 $ lerna run test

```
Commands to run against all the modules in your project

Check out an example [here](https://github.com/mr-builder/mrbuilder-monorepo-example)


### Yarn
Use `yarn` if you can it just works better. Also you use 
yarn [workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) if you can they make everything better.

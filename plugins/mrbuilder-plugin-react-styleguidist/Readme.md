A MR Builder plugin that provides [react-styleguidist](https://react-styleguidist.js.org/docs/getting-started.html) capabilities


The configuration is defined [here](https://react-styleguidist.js.org/docs/configuration.html)
With the exception that "components" property is hijacked and replaced with
module name.

* Note - react-styleguidist ships with an old version of webpack-dev-server, and
mrbuilder ships with a newer one.  If you get an error like:

```sh
  module.js:549
      throw err;
      ^

  Error: Cannot find module 'webpack/bin/config-yargs'
      at Function.Module._resolveFilename (module.js:547:15)
```

Please run to add it to your project, hopefully making it resolve before
react styleguist.
    ```sh
     $ yarn add webpack-dev-server@^3 -D
    ```

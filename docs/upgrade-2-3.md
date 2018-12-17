Mrbuilder 3.0 uses webpack 4.5 under the covers.   The configuration should remain
the same, however there are a 3 steps to get it to work.  This should only take
a minute or 2.  Mrbuilder now installs configured plugins/presets automatically.

- [ ] Remove all mrbuilder devDependencies from package.json -- yes all of them.
- [ ] Remove your `node_modules`.
- [ ] Add mrbuilder back again
```sh
   $ yarn add mrbuilder@latest
```

### Incompatible Changes
* Mrbuilder now defaults to assuming that the entry points are react classes, in
react app mode.   To disable this behaviour back to self managing entry points
```json
{
...
"mrbuilder":{
 "plugins":[
    ["mrbuilder-plugin-html", { "exported":false}]
  ]
}
}

```

* The root mrbuilder script now sets the env to itself, If no
`MRBUILDER_INTERNAL_PRESETS` are set, it will set it to mrbuilder, and use
the corresponding configuration.   This makes writing wrapper scripts
easier.

* Multiple profiles, Mrbuilder now supports multiple profiles at the same time using
the colon seperator.   For instance to start an app you can use
"start:app" and "start:app" env along with "start" and the "app" env will be applied in that
order.

* presets - Are now handled like plugins, rather than the env or the package.
This will probably not create issues, but --- you never know.

* individual scripts for Mrbuilder commands all point to `mrbuilder`, less code,
less error prone, more flexible.   If your builder was dependent on said scripts,
than you will need to move over to to the `bin/mrbuilder`

* mrbuilder-plugin-babel/bin/babel-cli.js has been renamed  mrbuilder-plugin-babel/bin/cli.js
to be more consistent with other commands and to allow for future command discovery.

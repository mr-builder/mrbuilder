Mrbuilder 2.0 uses webpack4.5 under the covers.   The configuration should remain
the same, however there are a 3 steps to get it to work.  This should only take
a minute or 2.  Mrbuilder now installs configured plugins/presets automatically.

- [ ] Remove all mrbuilder devDependencies from package.json -- yes all of them.
- [ ] Remove your `node_modules`.
- [ ] Add mrbuilder back again
```sh
   $ yarn add mrbuilder@^2.0.0
```

Done.


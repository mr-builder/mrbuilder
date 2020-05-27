{{scoped-namespace}}project
===
This project is a monorepo.  It uses [MrBuilder](https://github.com/mr-builder/mrbuilder) to do
the building and [Lerna](https://lernajs.io) to manage the packages.

### Linking
If you want to be able to easily access this monorepo from 
other projects,  the following command will link all the current
packages, however if you add a package you will need to run link
again.
```sh
 $ yarn link
```

To unlink all
```sh
 $ yarn unlink
```

### Streaming
Lerna is configured with the streaming option on,  this makes sure you know
which project is creating the output.   To disable remove `"streamg":true` from
the lerna.json

### Publishing
To publish the necessary commands you can run.

```sh
$ yarn lerna publish
```

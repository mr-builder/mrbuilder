Mr Builder ships with serveral tools in the form of node scripts.   These
are meant to be starting points for your own wrapper scripts customized to your
particular needs. In general they pull off mrbuilder args and otherwise pass
the arguments to the script they call.   So you should have access to the
underlying command line arguments.

### Options
| Script           | Wraps      | Description                        |
| ---------------- | -----------| -----------------------------------|
| mrbuilder-clean  | rimraf     | Cleans build directories           |
| mrbuilder-karma  | karma-cli  | starts karma with plugins          |
| mrbuilder-mocha  | mocha      | Run mocha from the command line    |
| mrbuilder-webpack| webpack    | Runs webpack                       |
| mrbuilder-demo   | webpack    | Runs webpack in demo mode          |
| mrbuilder-webpack-dev-server | webpack-dev-server | Runs the dev server|

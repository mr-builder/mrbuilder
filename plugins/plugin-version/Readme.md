This plugin provides some version information.  By default it uses
the version in your package.json

### Options

| Property      | Type       | Default          | Description                      |
| ------------- | -----------| -----------------| ---------------------------------|
| version       | string     | pkg.version      | version from packge.json         |
| variable      | string     | PKG_NAME_VERSION | variable name                    |
| NODE_ENV      | string     | NODE_ENV         | NODE_ENV                         |
| module        | string     | ./package.json   | the module to use for versioning |

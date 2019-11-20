Provides Jest support. Options are same as [Jest](https://jestjs.io/docs/en/configuration)  otherwise attempts to create
a working jest configuration given your current mrbuilder configuration.


It attempts to normalize mrbuilder (webpack) configuration, so that you do not need to have configs for both webpack
and jest

## Current Capabilities
 - Runs jest
 - Sets up CSS Module's for sass/less/css
 - Emulates require.context
 - Sets up graphql-loader style imports
 - Typescript


## Current Limitations
- Does not sync alias's 
- Does not work with @mrbuilder/plugin-worker (web worker's)
- More to follow.
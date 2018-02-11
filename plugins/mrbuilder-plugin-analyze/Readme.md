This plugin is used to run webpack-bundle-analyzer.

### Usage
The best way to run analyze is using the environmental variable, because
you probably want to see what webpack is doing for a particular env.
This is one of the cases where the ENV configuration is a better option.

// in package.json

```json
{
  "name":"your-project",
  ...
  devDependencies:{
    ...
    "mrbuilder-plugin-analyze":"^0.0.10"
  },
  "scripts":{
    "analyze":"MRBUILDER_INTERNAL_PLUGINS=mrbuilder-plugin-analyze yarn run prepublish",
    "prepublish":"mrbuilder-webpack"
  }

}

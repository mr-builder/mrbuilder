This plugin is used to run webpack-bundle-analyzer.

### Usage
The best way to run analyze is a yarn.

```sh
  $ yarn run analyze
```

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
    "analyze":"mrbuilder"
  }

}
```

### Options

| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| reportFileName| string     | report.html  | The filename of the report to generate|
| analyzerMode  | oneOf: server,static | server       | Server or static version         |

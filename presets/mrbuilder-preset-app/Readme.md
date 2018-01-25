mrbuilder-preset-app
===
This preset is to be used for top level applications.  It sets up
production and development.

## Installation
```sh
  $ yarn add "mrbuilder-preset-app" -D
```
## Configuration
In package.json
```json
{
 "name":"your_component"
 ...
 "scripts":{
    "start":"mrbuilder-webpack-dev-server",
    "prepublish":"mrbuilder-webpack"
 }
 "mrbuilder":{
    "presets":[
      "mrbuilder-preset-app"
    ]

 }
}
```

mrbuilder-plugin-browserslist
===
This plugin is designed to be used with [mrbuilder](https://github.com/jspears/mrbuilder).

## Installation
```sh
  $ yarn add "mrbuilder-plugin-browserslist" -D
```
## Configuration
In package.json
```json
{
 "name":"your_component"
 ...
 "mrbuilder":{
    "plugins":[
      "mrbuilder-plugin-browserslist"
    ]

 }
}
```
## Options
This allows for [browserslist](https://github.com/ai/browserslist) configuration
of autoprefixer and babel env.   You can follow any of the
methods of configuration, or it uses mrbuildlers default.   You probably
don't want to use mrbuilders default which is below.

```
[production]
last 2 version
ie 9

[development]
last 1 Chrome versions

[test]
last 1 Chrome versions


```



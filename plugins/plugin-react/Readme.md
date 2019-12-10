Provides react support for mrbuilder

### Options
| Property      | Type       | Default      | Description                      |
| ------------- | -----------| -------------| ---------------------------------|
| compatMode    | bool       | false        | Attempts to make new react look old so 3rd party components can work |
| useClassDisplayName | bool | true         | Adds displayname to react components so they display nicely in debuggers|

_Note:_ compatMode should not be used for libraries, but is OK for top level
apps.   For libraries there are no good solutions, luckily react does an awesome
job of maintaining compatibility.   This is just hack for when you just can't
upgrade.

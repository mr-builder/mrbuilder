A plugin to use [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard) thanks ken.

Configure the plugin
    
Run the dashboard 
```bash
$ MRBUILDER_INTERNAL_PLUGINS=mrbuilder-plugin-webpack ./node_modules/.bin/webpack-dashboard -p 3001 -- ./node_modules/.bin/mrbuilder-webpack-dev-server 
```
or add it to your package.json

```json
{
  "scripts": {
    "dashboard": "MRBUILDER_INTERNAL_PLUGINS=mrbuilder-plugin-webpack webpack-dashboard -p 3001 -- mrbuilder-webpack-dev-server"
  }
}
```
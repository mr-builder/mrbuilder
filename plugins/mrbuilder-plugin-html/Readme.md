mrbuilder-plugin-html
===
The HTML plugin allows for testing of components, and for compiling pages.
It is a wrapper around HtmlWebpackPlugin.


By default  looks first for a  public/index.js to bootstrap your app, if it
does not exist, than it uses a synthetic file that looks like

```jsx
    import React from 'react';
    import {render} from 'react-dom';
    import App from 'your-module';
    render(<App/>, document.getElementById('content'))
```

More than likely you should write your own render component, that looks
similar

## Installation
```
 $ yarn add mrbuilder-plugin-html -D
```

## Configuration
In package.json
```
 "name":"your_component",
 ...
 "mrbuilder":{
    "plugins":[
        "mrbuilder-plugin-html"
    ]
 }


````

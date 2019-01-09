The HTML plugin allows for testing of components, and for compiling pages.
It is a wrapper around HtmlWebpackPlugin.


By default  looks first for a  public/index.js to bootstrap your app, if it
does not exist, than it uses a synthetic file that looks like

```js static
    import React from 'react';
    import {render} from 'react-dom';
    import App from 'your-module';
    render(<App/>, document.getElementById('content'))
```

More than likely you should write your own render component, that looks
similar


### Configuration
In package.json
```json
 "name":"your_component",
 ...
 "mrbuilder":{
    "plugins":[
        "mrbuilder-plugin-html"
    ]
 }


````
### Custom Element
To configure which element your component renders to use elementId property,
where the value is the dom Id. By default it is "content".

## Hot loading
Hot loading setup is always a PNA -- this attempts to make it easier, however
to do this your "App" must export a class rather than the traditional export.

This can be controlled via the exported flag either per "page" or for all "pages".

## Custom Hot Loading
If exported is false, than you will need to set hot loading in your page, and your
running hot [see](https://github.com/gaearon/react-hot-loader) step 4.  The
rest of the steps are already done for you.

An example can be found [here](https://github.com/jspears/mrbuilder/tree/master/example/example-multi-app);

It should look something like.

```json

"mrbuilder":{
    "plugins":[
        ["mrbuilder-plugin-html", {exported:false}]
    ]
 }

```

Your entry point should look something like.

```js static
// main.js
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './containers/App'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(App)

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(App)
  })
}



```


### Pages
The pages points can be configured via pages object where the key will match
the entry point, or by default it will look into public/index.js, failing that
it will use the main defined in your package.json.

```js static
"mrbuilder":[
[
        "mrbuilder-plugin-html",
        {
          "pages": {
            "index": {//"index will match your entry for index.
              "title": "Index" // will set the title for the page.
            },
            "other": {
              "title": "Other",
              "exported": true // will tell the html plugin to create a real entry point and setup loading for this.
            }
          }
        }
      ]
]
```

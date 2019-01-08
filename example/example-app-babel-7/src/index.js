import React, { Component } from 'react';
import ExampleLib from 'example-lib';
import ExampleWebpack from 'example-lib-webpack';
import ExampleEverything from 'example-lib-everything';

export default class App extends Component {

    render() {
        /* eslint-disable no-undef */
        return (<div>
            <h1 id='hello-from-app'>Hello from App v{EXAMPLE_APP_BABEL_7_VERSION} with Babel <b>7</b></h1>
            <ExampleLib/>
            <ExampleWebpack/>
            <ExampleEverything/>
        </div>)
    }
}

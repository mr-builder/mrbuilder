import React, { Component } from 'react';
import ExampleLib from 'example-lib';
import ExampleWebpack from 'example-lib-webpack';
import ExampleEverything from 'example-lib-everything';

export default class App extends Component {

    render() {
        return (<div>
            <h1 id='hello-from-app'>Hello from App</h1>
            <ExampleLib/>
            <ExampleWebpack/>
            <ExampleEverything/>
        </div>)
    }
}

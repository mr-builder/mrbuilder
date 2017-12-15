import React, { Component } from 'react';
import { render } from 'react-dom';
import ExampleLib from 'example-lib';
import ExampleWebpacked from 'example-lib-webpack';

export default class App extends Component {

    render() {
        return <div>
            <h1>Hello from App</h1>
            <ExampleLib/>
            <ExampleWebpacked/>
        </div>
    }
}

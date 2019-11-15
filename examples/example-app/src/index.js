import React, { Component } from 'react';
import ExampleLib from '@mrbuilder/example-lib';
import ExampleWebpack from '@mrbuilder/example-lib-webpack';
import ExampleEverything from '@mrbuilder/example-lib-everything';

export default class App extends Component {

    render() {
        /* eslint-disable no-undef */
        return (<div>
            <h1 id='hello-from-app'>Hello from App v{MRBUILDER_EXAMPLE_APP_VERSION}</h1>
            <ExampleLib/>
            <ExampleWebpack/>
            <ExampleEverything/>
        </div>)
    }
}

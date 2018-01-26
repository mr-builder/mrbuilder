import React, { Component } from 'react';
import { render } from 'react-dom';
import Lib from 'example-lib';


export default class LibDemo extends Component {

    render() {
        return <div>
            <h1>Demo example for Example Lib</h1>
            <Lib/>
        </div>
    }
}

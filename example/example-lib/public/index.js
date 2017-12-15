import React, { Component } from 'react';
import { render } from 'react-dom';
import Lib from 'example-lib';


class LibTest extends Component {

    render() {
        return <div>
            <h1>Test for Example Lib</h1>
            <Lib/>
        </div>
    }
}

render(<LibTest/>, document.getElementById('content'));

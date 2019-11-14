import React, { Component } from 'react';
import { container } from './style.less';


export default class WebpackExample extends Component {

    render() {
        return (<div><span className={container}>Hello</span> from webpack
            example.</div>);
    }
}

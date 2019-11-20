import React, {Component} from 'react';
import {container} from './style.less';
import src from './smile.png';

export default class WebpackExample extends React.Component {

    render() {
        return (<div><span className={container}>Hello</span> from webpack example.</div>);
    }
}

export function Smile(props) {
    return <img src={src} {...props}/>
}
import React, { Component } from 'react';
import { container } from './style.less';
import SmilePng from './smile.png';

export default class WebpackExample extends Component {

    render() {
        return (<div><span className={container}>Hello</span> from webpack
            example.</div>);
    }
}
export function Smile(){
    return <img src={SmilePng}/>
}
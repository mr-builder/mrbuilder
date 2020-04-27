import React, {Component} from 'react';
import {container} from './style.module.less';
import Smile from './Smile';
export {default as Smile} from './Smile';

export default class WebpackExample extends Component {

    render() {
        return (<div><span className={container}>Hello</span> from webpack example. <Smile/></div>);
    }
}


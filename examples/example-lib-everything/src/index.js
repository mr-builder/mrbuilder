import React, { Component } from 'react';
import less, { container } from './style.less';
import moment from 'moment';
import map from 'lodash/map';
import Readme from '../Readme.md';
import Timer from './timer.worker';
import stylus from './stylus_module.stylm';
import './stylus.styl';
import { Hello } from './hello';
import yaml from './test.yaml';
import style from './style.cssm';

const USER     = process.env.USER;
const NODE_ENV = process.env.NODE_ENV;

export default class WebpackExample extends Component {

    state = {
        count: 0,
        time : Date.now()
    };

    constructor(...rest) {
        super(...rest);
        this.timer = new Timer();

        this.timer.onmessage =
            ({ data: { count } }) => this.setState({ count });
    }

    componentWillUnmount() {
        this.time && this.time.stop();
    }

    renderItem(idx) {
        return <li key={idx}>{idx}</li>
    };

    sendMessage = () => {
        this.setState({ time: Date.now() });
        this.timer.postMessage('hello');
    };

    render() {
        const time = moment(this.state.time).fromNow();


        return (<div>
            <span id="header" className={container}>Hello</span> from webpack
            everything example.
            <h2 className={less.user}>Hi {USER}! Your running with NODE_ENV:
                "{NODE_ENV}"</h2>
            <Readme className={stylus.readme}/>
            <ul>
                {map([1, 2, 3], this.renderItem)}
            </ul>
            <div id="yaml" className={'yaml'}>Yaml - {yaml.name}</div>
            <div className={'time'}>Time since button click: {time}</div>

            <Hello name={USER}/>
            <button className={style.stuff} onClick={this.sendMessage}>Count from web
                worker: {this.state.count}</button>
        </div>);
    }
}

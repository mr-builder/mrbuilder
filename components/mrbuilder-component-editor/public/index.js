import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '../src/index';
import Example from './Example';


export default class Index extends PureComponent {

    render() {
        return <div>
            <Editor id='first' component={Example}/>
            <Editor id='second' component={Example}/>
        </div>
    }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Editor from '../src/components/Editor';

class Example extends PureComponent {

    static propTypes = {
        name   : PropTypes.string,
        age    : PropTypes.number,
        alive  : PropTypes.bool,
        gender : PropTypes.oneOf(['Female', 'Male', 'Other']),
        kids   : PropTypes.array,
        onClick: PropTypes.func._doc('Onclick Handler')
    };

    static defaultProps = {
        age     : 10,
        kids    : [],
        noBool  : true,
        noString: 'noString',
        noFunc(){

        }
    };

    render() {
        return <div>{this.props.name} is {this.props.age} and is{'  '}
            {this.props.alive ? 'alive' : 'dead'}
            <ul>
                {this.props.kids.map(
                    v => <li key={v} onClick={this.props.onClick}>{v}</li>)}
            </ul>

        </div>
    }
}


export default class Index extends PureComponent {

    render() {
        return <Editor component={Example}/>
    }
}

import * as React from 'react';
import {number, string} from 'prop-types';

export interface HelloProps {
    name: string;
}

export type HelloState = {
    value?: number;
};

export class Hello extends React.Component<HelloProps, HelloState> {
    state = {
        value: 0,
    };

    handleIncrement = () => {
        this.setState({value: this.state.value + 1});
    };

    handleDecrement = () => {
        this.setState({value: Math.max(this.state.value - 1, 0)});
    };

    render() {
        return (
            <div className='hello'>
                <div className='greeting'>
                    Hello{' '}
                    {this.props.name + getExclamationMarks(this.state.value)}{' '}
                    from TypeScript
                </div>
                <div>
                    <button onClick={this.handleDecrement}>-</button>
                    <button onClick={this.handleIncrement}>+</button>
                </div>
            </div>
        );
    }
}

// helpers
function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}

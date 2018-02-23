import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { themeClass } from 'emeth';
import { parseValue } from './parse';
import { clamp } from './util';

export default class JSONEditor extends PureComponent {

    static displayName  = 'JSONEditor';
    static defaultProps = {
        min: 5,
        max: 50,
        onChange() {
        }
    };
    static propTypes    = {
        min      : PropTypes.number,
        max      : PropTypes.number,
        name     : PropTypes.string,
        type     : PropTypes.oneOf(['array', 'object']),
        value    : PropTypes.oneOfType(
            [PropTypes.string, PropTypes.array, PropTypes.object]),
        /**Fires on Change when it is valid **/
        onChange : PropTypes.func,
        /**Class name to wrap element **/
        className: PropTypes.string
    };

    state = {};

    componentDidMount() {
        this.setNameValue(this.props.name, this.props.value);
    }


    trim(value) {
        if (typeof value !== 'string') {
            return value;
        }
        switch (this.props.type) {
            case 'array':
                return value.replace(/^\[(.*)\]$/, '$1');
            case 'object':
                return value.replace(/^\{(.*)\}$/, '$1');
            default:
                return value.replace(/^(["'])(.*)\1$/, '$2');

        }
    }

    untrim(value) {
        switch (this.props.type) {
            case 'array':
                return parseValue(`[${this.trim(value)}]`);
            case 'object':
                return parseValue(`{${this.trim(value)}}`);
            case 'number':
                return parseValue(`${this.trim(value)}`);
            case 'string':
            default:
                return parseValue(`"${this.trim(value)}"`);

        }
    }

    setNameValue(name, value) {

        this.setState({ value });
        if (value && value[value.length - 1] === ',') {
            this.setState({ valid: false });
            return;
        }
        try {
            value = this.untrim(value);
            this.setState({ valid: true, value });
            this.props.onChange({ target: { name, value } });
        } catch (e) {
            console.trace(e);
            this.setState({ valid: false });
        }
    }

    handleChange = ({ target: { name, value } }) => {
        this.setNameValue(name, value);
    };

    render() {
        const { valid, value } = this.state;

        let inputValue = valid ? this.trim(JSON.stringify(value)) : value;
        inputValue     = inputValue == null ? '' : inputValue;
        const isArray  = this.props.type === 'array';
        return [
            isArray ? '[' : '{',
            <input key={'input'} type='text'
                   className={`${tc(this.state.valid ? ''
                       : 'invalid', 'input')} ${this.props.className}`}
                   value={inputValue}
                   size={clamp(inputValue.length, this.props.min,
                       this.props.max)}
                   name={this.props.name}
                   onChange={this.handleChange}/>,
            isArray ? ']' : '}'
        ]
    }
}
const tc = themeClass(JSONEditor);

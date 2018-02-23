import React, { PureComponent } from 'react';
import { themeClass } from 'emeth';
import PropTypes from 'prop-types';

const EMPTY_FUNC = `function(){
    //your code here

}`;

export default class FunctionEditor extends PureComponent {

    static displayName = 'FunctionEditor';

    static propTypes    = {

        name     : PropTypes.string,
        value    : PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        onChange : PropTypes.func._doc(
            'On change handler @param name @param value'),
        className: PropTypes.string._doc('CSS Class name')
    };
    static defaultProps = {
        onChange() {
        }
    };

    state = {};

    componentDidMount() {
        this.update(this.props)

    }

    update({ name, value = EMPTY_FUNC }) {
        this.setState({ value });
        try {
            value = typeof value === 'function' ? value : (new Function([],
                `return ${value};`))();
            this.setState({ valid: true });
            this.props.onChange({ target: { name, value } });

        } catch (e) {
            console.trace(e);
            this.setState({ valid: false });
        }
    }

    handleChange = ({ target }) => this.update(target);

    render() {
        const value = this.state.value + '' || EMPTY_FUNC;

        return <textarea
            className={`${tc(this.state.valid ? 'valid'
                : 'invalid')} ${this.props.className}`}
            value={value}
            name={this.props.name}
            onChange={this.handleChange}/>
    }

}
const tc = themeClass(FunctionEditor);

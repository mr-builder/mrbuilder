import React, { PureComponent } from 'react';
import { themeClass } from 'emeth';

const EMPTY_FUNC = `function(){
    //your code here

}`;

export default class FunctionEditor extends PureComponent {

    static displayName = 'FunctionEditor';

    state = {};

    constructor(props, ...rest) {
        super(props, ...rest);
    }

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

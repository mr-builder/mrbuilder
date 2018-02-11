import React, { PureComponent } from 'react';
import EditorStyle from './Editor.stylm';
import theme, { themeClass } from 'emeth';
import qs from 'qs';
import toReactDoc from '../toReactDoc';

theme({ Editor: EditorStyle });

const LC = '{', RC = '}';

class Property extends PureComponent {
    render() {
        const { name, description, children } = this.props;
        return [<span key={`prop-name-name-${name}`}>
                          <span
                              className={tc('prop-name')}>{name}</span>
            {description && <p className={tc('help')}>{description}</p>}
                        </span>,
            <span key={`prop-name-eq-${name}`}
                  className={tc('eq')}>=</span>,
            <span key={`prop-name-lc-${name}`}
                  className={tc('left-curly')}>{LC}</span>,
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>
                <span className={tc('value-value')}>{children}</span>
            </span>,
            <span key={`prop-name-rc-${name}`}
                  className={tc('right-curly')}>{RC}</span>]
    }
}

const unescape = v => v.replace(/'/g, '');

class FunctionEditor extends PureComponent {
    state = {
        value: ''
    };

    constructor(props, ...rest) {
        super(props, ...rest);
    }

    componentDidMount() {
        this.handleChange({ target: this.props });

    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ value });
        try {
            value = new Function([], `return ${value};`)();
            this.setState({ valid: true });
            this.props.onChange({ target: { name, value } });

        } catch (e) {
            this.setState({ valid: false });
            console.log(e);
        }
    };

    render() {
        const value = this.state.value + '';

        return <textarea
            className={`${tc(this.state.valid ? 'valid'
                : 'invalid')} ${this.props.className}`}
            value={value}
            name={this.props.name}
            onChange={this.handleChange}/>
    }

}

export default class Editor extends PureComponent {

    static defaultProps = {
        component: '',
        overrides: {}
    };

    static componentProps({ component, overrides }) {
        const info         = toReactDoc(component);
        return Object.keys(info).map((key) => {
            const { ...val } = info[key];
            const ove        = overrides[key];
            val.name = key;
            return key in overrides ? {
                ...val,
                ...ove,
            } : val;

        });


    }

    state = {
        ...Editor.parse(this.props),
    };

    static parse(props) {
        const q = qs.parse(window.location.search.substring(1));
        if (q) {
            return Editor.componentProps(props)
                         .reduce((ret, { type = {}, name }) => {
                             if (!(name in ret)) {
                                 return ret;
                             }
                             const v = ret[name];
                             switch (type.name) {
                                 case 'number':
                                     ret[name] = parseFloat(v, 10);
                                     break;
                                 case 'bool':
                                     ret[name] =
                                         v === true || v === false ? v : v
                                                                         === 'true';
                                     break;
                                 case 'array':
                                     ret[name] =
                                         Array.isArray(v) ? v : v.split(',');
                                     break;
                             }
                             return ret;
                         }, q);
        }
    }

    componentDidMount() {
        const _oonpopstate = this._oonpopstate = window.onpopstate;
        window.onpopstate = (e, ...args) => {
            _oonpopstate(e);
            this.setState(e.state);
        }
    }

    componentWillUnmount() {
        window.onpopstate = this._oonpopstate;
    }

    setHistoryState(state) {
        const newState = JSON.parse(
            JSON.stringify({ ...this.state, ...state }));
        const newUrl   = `?${qs.stringify(newState)}`;
        window.history.pushState(newState, null, newUrl);
        this.setState(state);
    }

    renderProp   = (ret = [], prop) => {
        const _key = `_${prop.type.name}`;
        if (typeof this[_key] === 'function') {
            const content = this[_key](prop);
            ret.push(' ', content);
        } else {
            console.warn(`no handler for ${prop.type.name}`)
        }
        return ret;
    };
    handleNumber = ({ target: { name, value } }) => {
        this.setHistoryState({ [name]: parseInt(value, 10) });
    };

    handleString = ({ target: { name, value } }) => {
        this.setHistoryState({ [name]: value });
    };

    handleBool      = ({ currentTarget: { name, checked } }) => {
        this.setHistoryState({ [name]: checked })
    };
    handleJsonArray = ({ target: { name, value } }) => {
        try {
            this.setHistoryState({ [name]: value.split(',') });
        } catch (e) {
            this.setHistoryState({ [name]: value });
        }
    };

    handleJson = ({ target: { name, value } }) => {
        try {
            this.setHistoryState({ [name]: JSON.parse(value) });
        } catch (e) {
            this.setHistoryState({ [name]: value });
        }
    };

    handleFunc = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    };

    _func({ type, name, description, defaultValue }) {
        const value = (name in this.state) ? this.state[name] : defaultValue
                                                                != null
            ? defaultValue : function (...args) {
                console.log(name, ...args)
            };
        return <Property key={`func-${name}`} name={name}
                         description={description}>
                 <span className={tc('value-value')}>
                    {name}
                </span>
            <FunctionEditor name={name}
                            className={tc('textarea')}
                            onChange={this.handleFunc}
                            value={value}/>
        </Property>
    }

    _object({ type, name, description, defaultValue = {} }) {
        const value = (name in this.state) ? this.state[name] : defaultValue;


        return <Property key={`object-${name}`} name={name}
                         description={description}>
                <textarea name={name} className={tc('textarea')}
                          onChange={this.handleJson}
                          value={JSON.stringify(value, null, 2)}/>
        </Property>
    }

    _array({ type, name, description, defaultValue = [] }) {
        const value        = (name in this.state) ? this.state[name]
            : defaultValue;
        const displayValue = Array.isArray(value) ? value.join(',') : value;

        return <Property key={`array-${name}`} name={name}
                         description={description}>
            [
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>

                <span className={tc('value-value')}>
                    <input className={tc('input')}
                           type='text'
                           name={name}
                           onChange={this.handleJsonArray}
                           size={displayValue && displayValue.length}
                           value={displayValue}/>
                </span>
            </span>
            ]
        </Property>
    }

    _enum({ type: { value = [] }, name, description, defaultValue }) {
        const selected = (name in this.state) ? this.state[name] : defaultValue;
        return <Property key={`oneOf-${name}`} name={name}
                         description={description}>
            <select className={tc('select')}
                    name={name}
                    onChange={this.handleString}
                    value={selected}>
                {value.map(
                    v => (<option key={unescape(v.value)}
                                  value={unescape(v.value)}>{unescape(
                        v.value)}</option>))}
            </select>
        </Property>
    }

    _number({ type, name, description, max, defaultValue = 0 }) {
        const value = (name in this.state) ? this.state[name] : defaultValue;
        if (typeof max === 'string') {
            max = this.props.value[max];
        }
        return <Property key={`number-${name}`} name={name}
                         description={description}>
            <input className={tc('input')}
                   type='number'
                   style={{ width: `${Math.max(1, ('' + value).length)}rem` }}
                   name={name}
                   value={value}
                   onChange={this.handleNumber}/>
            <TinySlider name={name} max={max}
                        value={value}
                        onChange={this.handleNumber}/>
        </Property>

    }

    _string({ type, name, description, defaultValue = '' }) {
        const value = (name in this.state) ? this.state[name] : defaultValue;
        return (<Property key={`string-${name}`} name={name}
                          description={description}>
            <input className={tc('input')}
                   type='text'
                   name={name}
                   size={Math.max(1, value ? value.length : 1)}
                   value={value}
                   onChange={this.handleString}/>
        </Property>);

    }

    _bool({ type, name, description, defaultValue }) {
        const value = (name in this.state) ? this.state[name] : defaultValue;
        return <Property key={`bool-${name}`} name={name}
                         description={description}>
            <input type='checkbox'
                   style={{ visibility: 'hidden' }}
                   id={`${name}-check`}
                   name={name}
                   checked={!!value}
                   onChange={this.handleBool}/>
            <label htmlFor={`${name}-check`}
                   className={tc('value-value', 'checkbox')}>
                {value ? 'true' : 'false'}
            </label>
        </Property>
    }

    handleReset = () => {
        const state = this.state;
        this.setHistoryState(Object.keys(state).reduce((ret, key) => {
            ret[key] = void(0);
            return ret;
        }, {}))
    };

    render() {
        const props  = Editor.componentProps(this.props)
                             .reduce(this.renderProp, []);
        const Target = this.props.component;
        return (<div className={tc('sample')}>
            <pre className={tc('code')}>&lt;
                <span className={tc('component')}
                      title={'Click to reset to defaults'}
                      onClick={this.handleReset}>
                    {this.props.component.displayName
                     || this.props.component.name}
                </span>
                {props}{' '}/&gt;
        	</pre>
            <Target {...this.state}/>

        </div>);
    }
}
const tc = themeClass(Editor);

class TinySlider extends PureComponent {

    render() {
        const { description, ...rest } = this.props;
        return (<div className={tc('tiny')}>
            <input type='range'
                   {...rest}
                   key={`input-range`}/>
            {description && <p
                className={tc("tiny-description-block")}>{description}</p>}
        </div>)
    }
}

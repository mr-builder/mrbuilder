import React, { PureComponent } from 'react';
import JSONEditor from './JSONEditor';
import FunctionEditor from './FunctionEditor';
import TinySlider from './TinySlider';
import Property from './Property';
import { themeClass } from 'emeth';
import qs from 'qs';
import PropTypes from 'prop-types';
import { clamp } from './util';
import toReactDoc from 'mrbuilder-plugin-doc-prop-types/src/toReactDoc';

const unescape = v => v.replace(/'/g, '');

const uniqueKeys = (...args) => args.reduce((ret, obj) => {
    ret.push(...Object.keys(obj).filter(key => !ret.includes(key)));
    return ret;
}, []);

export default class Editor extends PureComponent {
    static propTypes = {
        component  : PropTypes.func,
        overrides  : PropTypes.object,
        id         : PropTypes.string,
        /**
         * Keep the Element in sync with url.
         */
        syncHistory: PropTypes.bool
    };

    static defaultProps = {
        component  : '',
        overrides  : {},
        props      : {},
        id         : '',
        syncHistory: false,
    };

    static componentProps({ component, overrides, props }) {
        const info = toReactDoc(component);
        return uniqueKeys(info, overrides, props).map((key) => {
            const { ...val } = info[key];
            const ove        = overrides[key];

            val.name = key;


            const prep = key in overrides ? {
                ...val,
                ...ove,
            } : val;
            if (key in props) {

                return {
                    ...prep,
                    defaultValue: {
                        ...prep.defaultValue,
                        value: props[key]
                    }
                }
            }
            return prep;

        });

    }

    state = {
        ...Editor.parse(this.props),
    };

    static parse(props) {
        let q = qs.parse(window.location.search.substring(1));
        if (q) {
            if (props.id) {
                q = q[props.id];
            }
        }
        q = q || {};

        const ret = Editor.componentProps(props)
                          .reduce((ret,
                                   { type = {}, defaultValue: { value } = {}, name }) => {
                              const v = ret[name] || value;
                              switch (type.name) {
                                  case 'number':
                                      ret[name] = parseFloat(v, 10);
                                      break;
                                  case 'bool':
                                      ret[name] =
                                          v === true || v === false ? v : v
                                                                          === 'true';
                                      break;
                                  case 'union':
                                  case 'array':
                                      ret[name] =
                                          !v ? [] : Array.isArray(v) ? v
                                              : v.split(',');
                                      break;
                                  case 'func':
                                  case 'function':
                                      if (typeof v !== 'function') {
                                          ret[name] = (new Function([],
                                              `return ${v}`))();
                                          break;
                                      }
                                  default:
                                      ret[name] = v;
                              }
                              return ret;
                          }, q);
        return ret;

    }

    componentDidMount() {
        if (this.props.syncHistory) {
            const _oonpopstate = this._oonpopstate = window.onpopstate;
            window.onpopstate = (e, ...args) => {
                _oonpopstate(e);
                if (this.props.id) {
                    this.setState(e.state[this.props.id]);
                } else {
                    this.setState(e.state);
                }
            }
        }
    }

    componentWillUnmount() {
        if (this._oonpopstate) {
            window.onpopstate = this._oonpopstate;
        }
    }

    setHistoryState(state, reset) {
        if (this.props.syncHistory) {

            const newState = JSON.parse(
                JSON.stringify({ ...this.state, ...state }));
            const current  = qs.parse(window.location.search.substring(1));


            Object.assign(current,
                this.props.id ? { [this.props.id]: reset ? null : newState }
                    : reset ? null : newState);


            const newUrl = `?${qs.stringify(current)}`;

            window.history.pushState(current, null, newUrl);
        }
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

    handleBool = ({ currentTarget: { name, checked } }) => {
        this.setHistoryState({ [name]: checked })
    };

    handleJson = ({ target: { name, value } }) => {
        this.setHistoryState({ [name]: value });
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
            {'{'}
                <JSONEditor className={tc('input')}
                type='object'
                name={name}
                onChange={this.handleJson}
                min={5}
                max={50}
                value={value}/>
            {'}'}
        </Property>
    }

    _union(...args) {
        return this._array(...args);
    }

    _array({ type, name, description, defaultValue: { value: defaultValue } }) {
        const value = (name in this.state) ? this.state[name]
            : defaultValue;
        return <Property key={`array-${name}`} name={name}
                         description={description}>
            {'['}
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>

                <span className={tc('value-value')}>
                    <JSONEditor className={tc('input')}
                                type='array'
                                name={name}
                                onChange={this.handleJson}
                                min={5}
                                max={50}
                                value={value}/>
                </span>
            </span>
            {']'}
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
                   style={{ width: `${clamp(('' + value).length, 2, 10)}rem` }}
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
                   size={clamp(value && value.length, 1, 25)}
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
        }, {}), true);
    };

    render() {
        const props  = Editor.componentProps(this.props)
                             .reduce(this.renderProp, []);
        const Target = this.props.component;
        return (<div className={`${tc('sample')} ${this.props.className}`}>
            <pre className={tc('code')}>&lt;
                <span className={tc('component')}
                      title={'Click to reset to defaults'}
                      onClick={this.handleReset}>
                    {this.props.component.displayName
                     || this.props.component.name}
                </span>
                <span className={tc('props')}>
                {props}{' '}/&gt;
                </span>
        	</pre>
            <div className={this.props.exampleClass}>
                <Target {...this.state}/>
            </div>
        </div>);
    }
}
const tc = themeClass(Editor);

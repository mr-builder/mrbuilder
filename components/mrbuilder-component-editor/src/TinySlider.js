import React, { PureComponent } from 'react';
import { themeClass } from 'emeth';

export default class TinySlider extends PureComponent {

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
const tc = themeClass(TinySlider);

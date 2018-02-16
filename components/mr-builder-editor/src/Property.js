import React, { PureComponent } from 'react';

import { themeClass } from 'emeth';

const LC = '{', RC = '}';

export default class Property extends PureComponent {
    static displayName = 'Property';

    render() {
        const { name, description, children } = this.props;
        return <span key={`prop-name-name-${name}`} className={tc('prop-val')}>
            <span>
            <span className={tc('prop-name')}>{name}</span>
                {description && <p className={tc('help')}>{description}</p>}
                        </span>
            <span key={`prop-name-eq-${name}`}
                  className={tc('eq')}>=</span>
            <span key={`prop-name-lc-${name}`}
                  className={tc('left-curly')}>{LC}</span>
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>
                <span className={tc('value-value')}>{children}</span>
            </span>
            <span key={`prop-name-rc-${name}`}
                  className={tc('right-curly')}>{RC}</span>
        </span>
    }
}

const tc = themeClass(Property);

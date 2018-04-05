import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import Logo from '../../mrbuilder.svg';

const styles = ({ color, fontFamily, fontSize }) => ({
    logo   : {
        color     : color.base,
        margin    : 0,
        fontFamily: fontFamily.base,
        fontSize  : fontSize.h4,
        fontWeight: 'normal',
    },
    img    : {
        display: 'block',
        width  : '100%',
        height : 'auto'
    },
    version: {
        float     : 'right',
        fontFamily: fontFamily.base,
        fontSize  : 10
    }
});

export function LogoRenderer({ classes }) {
    /* eslint-disable no-undef */

    return (<div>
        <img src={Logo} className={classes.img}/>
        <div className={classes.version}>v{MRBUILDER_VERSION}</div>
    </div>)
}

LogoRenderer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default Styled(styles)(LogoRenderer);

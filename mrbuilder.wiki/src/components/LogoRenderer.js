import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import Logo from '../../mrbuilder.svg';

const styles = ({ color, fontFamily, fontSize }) => ({
    logo: {
        color     : color.base,
        margin    : 0,
        fontFamily: fontFamily.base,
        fontSize  : fontSize.h4,
        fontWeight: 'normal',
    },
    img : {
        display: 'block',
        width  : '100%',
        height : 'auto'
    }
});

export function LogoRenderer({ classes }) {
    return <img src={Logo} className={classes.img}/>
}

LogoRenderer.propTypes = {
    classes : PropTypes.object.isRequired
};

export default Styled(styles)(LogoRenderer);

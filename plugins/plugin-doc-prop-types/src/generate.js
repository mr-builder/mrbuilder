module.exports = function ({ keys }) {

    const writeExport =
              key => `export const ${key} = wrapType(_PropTypes['${key}'],'${key}')`;

    const code = `
import _PropTypes from 'prop-types-internal';
import wrapType from './wrapType';

export const checkPropTypes = _PropTypes.checkPropTypes;

${keys.map(writeExport).join(';\n')}   

 
export const PropTypes = {    
${keys.join(',\n')},   
checkPropTypes 
}
//for compatibility
PropTypes.PropTypes = PropTypes;

export default PropTypes;    
`;
    return {
        code,
        cacheable: true
    }
}

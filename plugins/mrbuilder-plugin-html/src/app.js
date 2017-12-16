module.exports = ({ name, node = 'content' }) => {
    const code = `
    import React from 'react';
    import {render} from 'react-dom';
    import App from '${name}';
    render(<App/>, document.getElementById('${node}'))
    `;

    return {
        code,
        cacheable: true
    };
}

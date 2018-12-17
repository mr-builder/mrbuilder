const loaderUtils = require('loader-utils');

const importAs = (exported) => {
    if (exported === true) {
        return 'App';
    }
    if (typeof exported === 'string') {
        return `{ ${exported} as App }`
    }
};

const generate = (name, node, exported) => `

import {render} from 'react-dom';
import React from 'react';
import ${importAs(exported)} from '${name}';

render(<App/>, document.getElementById('${node}'));
`;

const generateHot = (name, node, exported) => `
import {render} from 'react-dom';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import ${importAs(exported)} from '${name}';

const HotApp = hot(App);
const init = Component => {
  render(<Component/>, document.getElementById('${node}'));
}

init(HotApp);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('${name}', () => init(App))
}
`;


module.exports = function () {
    this.cacheable && this.cacheable();
    const { hot, name, elementId, exported } = loaderUtils.getOptions(this);
    return (hot ? generateHot : generate)(name, elementId, exported)
};
module.exports.generate = generate;
module.exports.generateHot = generateHot;

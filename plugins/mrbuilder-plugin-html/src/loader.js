const loaderUtils = require('loader-utils');
const generate    = (name, node) => `

import {render} from 'react-dom';
import React from 'react';
import App from '${name}';

render(<App/>, document.getElementById('${node}'));
`;

const generateHot = (name, node) => `
import {render} from 'react-dom';
import React from 'react';
import { AppContainer } from 'react-hot-loader'
import App from '${name}';

const init = Component => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('${node}'),
  )
}
init(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('${name}', () => init(App))
}
`;


module.exports = function () {
    this.cacheable && this.cacheable();
    const { hot, name, elementId } = loaderUtils.getOptions(this);
    return (hot ? generate : generateHot)(name, elementId)
};

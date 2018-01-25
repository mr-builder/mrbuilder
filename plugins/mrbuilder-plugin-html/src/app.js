const generate = (name, node) => `import React from 'react';
import {render} from 'react-dom';
import App from '${name}';

render(<App/>, document.getElementById('${node}'));
`;

const generateHot = (name, node) => `import React from 'react';
import {render} from 'react-dom';
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

module.exports = ({ name, hot = false, node = 'content' }) => {

    const code = hot ? generateHot(name, node) : generate(name, node);

    return {
        code,
        cacheable: true
    };
};

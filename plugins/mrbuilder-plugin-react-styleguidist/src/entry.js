/* eslint-disable import/first */

import 'react-styleguidist/lib/polyfills';
import 'react-styleguidist/lib/styles';
import ReactDOM from 'react-dom';
import renderStyleguide from 'react-styleguidist/lib/utils/renderStyleguide';
import mergeProps from 'mrbuilder-plugin-doc-prop-types/src/mergeProps';
// Examples code revision to rerender only code examples (not the whole page)
// when code changes
var codeRevision = 0;

var render = function render() {
    // eslint-disable-next-line import/no-unresolved
    var styleguide = require(`!!react-styleguidist/loaders/styleguide-loader!react-styleguidist/lib/index.js`);
    mergeProps(styleguide);
    ReactDOM.render(renderStyleguide(styleguide, codeRevision),
        document.getElementById('app'));
};

window.addEventListener('hashchange', render);

/* istanbul ignore if */
if (module.hot) {
    module.hot.accept(`!!react-styleguidist/loaders/styleguide-loader!react-styleguidist/lib/index.js`, function () {
        codeRevision += 1;
        render();
    });
}

render();

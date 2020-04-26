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
import "regenerator-runtime/runtime";
import {renderer} from "@bikeshaving/crank/dom";

import ${importAs(exported)} from '${name}';

renderer.render(<App/>, document.getElementById('${node}'));
`;


module.exports = function () {
    this.cacheable && this.cacheable();
    const {name, elementId, exported} = loaderUtils.getOptions(this);
    return generate(name, elementId, exported)
};
module.exports.generate = generate;

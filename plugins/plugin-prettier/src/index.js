const prettierConf = require('./prettier.config.js');

module.exports = function ({test}, webpack, om) {
    if (!test) {
        if (om.enabled('@mrbuildre/plugin-typescript')) {
            test = /[.](?:[jet]sx|mjs)?$/;
        } else {
            test = /[.]js[x]?$/;
        }
    }
    webpack.module.rules.push([
        {
            test,
            use: {
                loader: 'prettier-loader',

                // force this loader to run first if it's not first in loaders list
                enforce: 'pre',

                // avoid running prettier on all the files!
                // use it only on your source code and not on dependencies!
                exclude: /node_modules/,

                // additional prettier options assigned to options in
                // - .prettierrc,
                // - prettier.config.js,
                // - "prettier" property in package.json
                options: prettierConf(),
            }
        }
    ]);

    return webpack;

};

const path                = require('path');
const { enhancedResolve } = require('mrbuilder-utils');

module.exports = function ({
                               test = /[.]tsx?$/,
                               baseUrl = process.cwd(),
                               extensions = [".ts", ".tsx"],
                               context,
                               configFile
                           },
                           webpack, om) {


    const options = {};

    if (context) {
        (this.info || console.log)('using context', context);
        options.context = context;
    }

    if (configFile) {
        options.configFile = configFile;
    }else{
        (this.info || console.log)('You are probable better off putting a tsconfig.json in your project'
                                   + 'directory, as tsc really really wants to find files see the Readme')
    }
    const use = [

        {
            loader: 'ts-loader',
            options
        },
    ];
    if (process.env.NODE_ENV !== 'production') {
        use.unshift('source-map-loader')
    }
    webpack.module.rules.push({
        test,
        use
    });

    if (extensions) {
        if (!webpack.resolve.extensions) {
            webpack.resolve.extensions = [];
        }
        webpack.resolve.extensions.push(...extensions)
    }
    return webpack;
};

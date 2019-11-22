const manageTsConfig = require('./manageTsConfig');
module.exports = function ({
                               test = /[.]tsx?$/,
                               baseUrl = process.cwd(),
                               extensions,
                               useBabel = false,
                               allowTsInNodeModules = false,
                               context,
                               configFile
                           }, webpack, om) {
    manageTsConfig(om);

    if (extensions) {
        if (!webpack.resolve.extensions) {
            webpack.resolve.extensions = [];
        }
        webpack.resolve.extensions.push(...extensions)
    }

    if (useBabel || om.enabled('@mrbuilder/plugin-jest')) {
        if (require('@mrbuilder/plugin-babel/version') > 6) {
            return webpack;
        } else {
            (this.warn || console.warn)(`Sorry we can only support typescript babel plugin with @mrbuilder/plugin-babel-7  
            and this option has no effect with the babel 6 loader.
            `);
        }
    }
    const options = {
        allowTsInNodeModules,
    };

    if (context) {
        (this.info || console.log)('using context', context);
        options.context = context;
    }

    if (configFile) {
        options.configFile = configFile;
    } else {
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


    return webpack;
};

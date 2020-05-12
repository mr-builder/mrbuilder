const manageTsConfig = require('./manageTsConfig');
const {Util} =require('@mrbuilder/cli');

module.exports = function ({
                               test,
                               baseUrl = process.cwd(),
                               extensions,
                               useBabel,
                               allowTsInNodeModules,
                               context,
                               configFile,
                               forkTSConfig,
                           }, webpack, om) {

    manageTsConfig(om);
    const logger = om.logger('@mrbuilder/plugin-webpack');
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
            logger.info(`Sorry we can only support typescript babel plugin with @mrbuilder/plugin-babel-7  
            and this option has no effect with the babel 6 loader.
            `);
        }
    }
    const options = {
        allowTsInNodeModules,
    };

    if (context) {
        logger.info('using context', context);
        options.context = context;
    }

    if (configFile) {
        options.configFile = configFile;
    } else {
        logger.info('You are probable better off putting a tsconfig.json in your project'
            + 'directory, as tsc really really wants to find files see the Readme')
    }

    if(forkTSConfig){
        const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

        webpack.plugins.push(new ForkTsCheckerWebpackPlugin({
            typescript: om.require.resolve('typescript'),
            async: !Util.isProduction,
            useTypescriptIncrementalApi: true,
            checkSyntacticErrors: true,
            resolveModuleNameModule: process.versions.pnp
                ? require.resolve`${__dirname}/pnpTs.js`
                : undefined,
            resolveTypeReferenceDirectiveModule: process.versions.pnp
                ? `${__dirname}/pnpTs.js`
                : undefined,
            tsconfig: configFile,
            reportFiles: [
                '**',
                '!**/__tests__/**',
                '!**/?(*.)(spec|test).*',
                '!**/src/setupProxy.*',
                '!**/src/setupTests.*',
            ],
            silent: true,
            // The formatter is invoked directly in WebpackDevServerUtils during development
            formatter: Utils.isProduction ? typescriptFormatter : undefined,
        }));
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

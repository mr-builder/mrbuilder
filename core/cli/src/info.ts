import om from './instance';

const {
    env
} = process;

const NODE_ENV = env.NODE_ENV = env.NODE_ENV || om.config('@mrbuilder/cli.node_env');

export const isDevServer = om.enabled('@mrbuilder/plugin-webpack-dev-server') || om.config('@mrbuilder/cli.devServer');


export const isKarma = om.enabled('@mrbuilder/plugin-karma');

export const isTest = NODE_ENV === 'test' || isKarma || om.enabled('@mrbuilder/plugin-mocha') || om.enabled('@mrbuilder/plugin-jest');

export const mode = om.config('@mrbuilder/plugin-webpack.mode',
    NODE_ENV ||
    (isTest || isDevServer) ? 'development' : 'production'
);

export const isApp = !!om.config('@mrbuilder/plugin-webpack.app'),
    isDemo = !!om.config('@mrbuilder/plugin-webpack.demo'),
    isHtml = om.enabled('@mrbuilder/plugin-html'),
    isHot = om.enabled('@mrbuilder/plugin-hot'),
    isTypescript = om.enabled('@mrbuilder/plugin-typescript'),
    isDebug = om.env('DEBUG', false),
    isProduction = mode == null ? NODE_ENV === 'production' : mode
        === 'production',

    /**
     * isLibrary can not be true if its running in a dev server, or as an app
     * or as a demo.  But otherwise its true, because library build is the
     * default.
     *
     * @type {boolean}
     */

    isLibrary = !(isTest || isDevServer || isApp || isDemo);
export default ({
    isTest,
    isKarma,
    isDebug,
    isProduction,
    isDevServer,
    isApp,
    isDemo,
    isHtml,
    isHot,
    isLibrary
});


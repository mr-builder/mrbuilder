import om from './instance';

const {
    env
} = process;

const NODE_ENV = env.NODE_ENV = env.NODE_ENV || om.config('@mrbuilder/cli.node_env');

export const isDevServer = om.config('@mrbuilder/cli.devServer');
export const isKarma = om.enabled('@mrbuilder/plugin-karma') ;

export const isTest = NODE_ENV === 'test' || isKarma || om.config('@mrbuilder/cli.test');

export const mode = om.config('@mrbuilder/plugin-webpack.mode',
    NODE_ENV ||
    (isTest || isDevServer) ? 'development' : 'production'
);

export const isApp = !!om.config('@mrbuilder/plugin-webpack.app') || om.enabled('@mrbuilder/plugin-storybook.app'),
    isDemo = !!om.config('@mrbuilder/plugin-webpack.demo'),
    isHtml = om.enabled('@mrbuilder/plugin-html'),
    isHot = om.enabled('@mrbuilder/plugin-hot'),
    isTypescript = om.enabled('@mrbuilder/plugin-typescript'),
    isDebug = env.DEBUG || om.env('DEBUG', false),
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


const setup = ({
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

if (isDebug){
    console.log(Object.entries(setup).map(([key,value])=>`${key}\t: ${value}`).join('\n'));
}

export default setup;

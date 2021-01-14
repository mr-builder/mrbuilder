const useStyle         = require('./styleLoader');
const getLocalIdent    = require('./getLocalIdent');
const {oneOf, isOneOf} = require('./oneOf');

function addCssRule(webpack, rule) {
    if (!webpack.module.rules.find(isOneOf)) {
        webpack.module.rules.push({oneOf});
    }
    oneOf.push(rule);
}

function cssLoader(webpack, test, modules = false, om, ...conf) {
    addCssRule(webpack, cssLoaderGen(webpack, test, modules, om, ...conf));
}

function cssLoaderGen(webpack, test, modules = false, om, ...conf) {

    const mrb              = (v, d) => om.config('@mrbuilder/plugin-css' + (v ? `.${v}` : ''), d);
    const localsConvention = mrb('localsConvention', mrb('camelCase', true) ? 'camelCase' : 'asIs');
    const sideEffects      = mrb('sideEffects', true);

    const loaders = [{
        loader : 'css-loader',
        options: modules ? {
            sourceMap: mrb('sourceMap', true),
            localsConvention,
            modules  : modules ? {
                ...(typeof modules === 'object' ? modules : {}),
                localIdentName: mrb('localIdentName', '[hash]_[package-name]_[hyphen:base-name]_[local]'),
                context       : mrb('context', om.config('@mbuilder/cli.sourceDir', 'src')),
                getLocalIdent
            } : false
        } : {
            sourceMap: mrb('sourceMap', true),
            localsConvention,
            modules  : modules ? {
                ...(typeof modules === 'object' ? modules : {}),
                context: mrb('context', om.config('@mbuilder/cli.sourceDir', 'src'))
            } : false
        }
    }];
    const plugins = [];
    if (mrb('autoprefixer')) {
        plugins.push(require('autoprefixer')());
    }
    if (mrb('postcss')) {
        mrb('postcss', []).forEach(v => {
            if (Array.isArray(v)) {
                plugins.push(require(v[0])(...v.slice(1)));
            } else if (typeof v === 'string') {
                plugins.push(require(v)());
            } else if (typeof v === 'function') {
                plugins.push(v());
            }
        });
    }
    if (plugins.length) {
        loaders.push({
            loader : 'postcss-loader',
            options: {
                plugins
            }
        });
    }


    if (conf) {
        loaders.push(...conf);
    }
    if (!test) {
        throw new Error(`Must have a test condition for this plugin '${test}'`);
    }
    return {
        //So rather than forcing people to do negative regex'swe will do it here.
        // so I guess it breaks a css file named with .module. but, whatever.
        test,
        use: useStyle(webpack, ...loaders),
        sideEffects
    }
}

/**
 * Sets up Webpack for modules (or not), 3 ways
 * 1 - without css modules.
 * 2 - with css modules when the file ends in .module.ext
 * 3 - with css modules when the file ends in a regex that matches the 'modules' RegExp.
 * @param webpack - Webpack Configuration
 * @param modules boolean | RegExp - to enable/disable modules
 * @param test RegExp | false - enables/disables non-css modules or the pattern that matches
 * @param om - OptionsManager
 * @param conf - The configuration for that type of loader.
 * @return {*}
 */
const cssLoaderModule     = (webpack,
                             modules,
                             test,
                             om,
                             ...conf) => {

    if (modules) {

        if (test) {
            const oneOf = [];
            //__MATCHED__ is just to here so we can be sure we matched the regex and the file didn't just end in .module
            const mod   = (v) => {
                return v.replace(test, '.___MATCHED___').endsWith('.module.___MATCHED___');
            }
            mod.toJSON  = () => `module:${test}`

            //Really sorry about this madness -- So Jest wants to match only on RegExp.  So here
            // Jest doesn't need to be as accurate a replacement, because they are all handled through
            // and ignore proxy anyways.
            mod.source = test && test.source || modules && modules.source;

            addCssRule(webpack, cssLoaderGen(webpack, mod, true, om, ...conf));


            if (!(test instanceof RegExp)) {
                throw new Error(`test is not a regex ` + test);
            }
            const unmod = (v) => {
                return v.replace(test, '.___MATCHED___').endsWith('.module.___MATCHED___') ? false : test.test(v)
            }

            unmod.toJSON = () => `not-module:${test}`;

            addCssRule(webpack, cssLoaderGen(webpack, unmod, false, om, ...conf));
        }
        //So if module === true then we will only support '.module.ext' syntax,
        // if module is a regex, well we will support it. This is for backwards
        // compatibilty with .sccm, .lessm and friends.
        if (modules instanceof RegExp) {
            cssLoader(webpack, modules, true, om, ...conf);
        }

    } else if (test) {
        //Test needs some magic if using module.ext if no modules, no magic needed.
        cssLoader(webpack, test, false, om, ...conf)
    }
    return webpack;
}
cssLoader.cssLoaderModule = cssLoaderModule;
cssLoader.cssLoader       = cssLoader;
module.exports            = cssLoader;

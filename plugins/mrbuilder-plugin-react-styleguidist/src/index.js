const getConfig = require('react-styleguidist/scripts/config');
const sylist    = require('react-styleguidist/scripts/make-webpack-config');
const path      = require('path');
const {
          cwd,
          enhancedResolve
      }         = require('mrbuilder-utils');

module.exports = function (options = {}, webpack, om) {

    const resolvePkgDir = (v, ...args) => path.join(
        om.require.resolve(path.join(v, 'package.json')), '..', ...args);


    const componentsToSections = (opts) => {
        if (!opts) {
            return;
        }
        const components = opts.components;
        delete opts.components;
        const sections = components && components.map(function (component) {
            component = Array.isArray(component) ? component : [component];

            const _pkgDir = resolvePkgDir(component[0]);

            const _pkg = require(path.join(_pkgDir, 'package.json'));

            const obj = {
                name       : _pkg.name,
                description: _pkg.description,
                content    : resolvePkgDir(component[0], 'Readme.md')
            };


            const makeComponent = (name = '[A-Z]*') => {


                const key = path.join(
                    path.relative(cwd(),
                        path.join(_pkgDir, 'src')), name);

                return `${key}.{js,jsx}`;
            };


            if (Array.isArray(components[1])) {
                obj.sections = components[1].map(v => ({
                    components: makeComponent(v)
                }));
            } else {
                obj.components = makeComponent(component[1]);
            }
            return obj;
        }) || [];
        if (opts.sections) {
            opts.sections = opts.sections.map(componentsToSections);
        } else {
            opts.sections = []
        }
        if (opts.require) {
            opts.require = opts.require.map(enhancedResolve);
        }
        opts.sections = opts.sections.concat(sections);
        return opts;
    };
    if (options.styleguideComponents) {
        options.styleguideComponents =
            Object.keys(options.styleguideComponents).reduce((ret, key) => {
                ret[key] = enhancedResolve(options.styleguideComponents[key]);
                return ret;
            }, {});
    }
    componentsToSections(options);
    if (options.styleguideComponents) {
        const { styleguideComponents } = options;
        options.styleguideComponents   = Object.keys(styleguideComponents)
                                               .reduce((ret, key) => {
                                                   ret[key] = enhancedResolve(
                                                       styleguideComponents[key]);
                                                   return ret;
                                               }, {})
    }

    const conf = getConfig(options);


    if (!options.getComponentPathLine) {
        conf.getComponentPathLine = (componentPath) => {

            const [all, name, comp] = /.*\/(.+?)\/src\/(?:.*\/)?([A-Z].+?)\.(js|jsx)$/.exec(
                componentPath) || [];
            let ret                 = componentPath;
            if (comp && name) {
                ret = `import {${comp}} from '${name}'`;
            }
            return ret;
        };
    }

    delete conf.components;


    const ret = sylist(conf, {});
    webpack.plugins.push(...ret.plugins);
    ret.entry.splice(0, 1, `${__dirname}/entry.js`);
    webpack.entry = ret.entry;

    Object.assign(webpack.resolve.alias, ret.resolve.alias);
    (webpack.performance || (webpack.performance = {})).hints = false;

    return webpack;
};

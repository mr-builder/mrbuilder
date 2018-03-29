const getConfig = require('react-styleguidist/scripts/config');
const sylist    = require(
    'react-styleguidist/scripts/make-webpack-config');
const {
          join,
          relative
      }         = require('path');
const {
          cwd,
          enhancedResolve
      }         = require('mrbuilder-utils');

module.exports = function (options = {}, webpack, om) {

    const resolvePkgDir        = (v, ...args) => join(
        om.require.resolve(join(v, 'package.json')), '..', ...args);
    const componentsToSections = (opts) => {
        if (!opts) {
            return;
        }
        const components = opts.components;
        delete opts.components;
        const sections = components && components.map(function (component) {
            component = Array.isArray(component) ? component : [component];

            /**
             * ['pkg']
             * ['pkg', 'MyComponent'],
             * ['pkg', ['A', 'B'],
             * ['pkg', {
             *    components:['A','B']
             * }]
             *
             *
             */

            const _pkgDir = resolvePkgDir(component[0]);

            const _pkg = require(join(_pkgDir, 'package.json'));

            const obj = Object.assign({
                    name       : _pkg.name,
                    description: _pkg.description,
                    content    : resolvePkgDir(component[0], 'Readme.md'),
                    sections   : [],
                },
                typeof component[1] === 'string' ? {
                    components: [component[1]]
                } : Array.isArray(component[1]) ? {
                    components: component[1]
                } : component[1] != null ? component[1] : {});


            const makeComponent = (name = '[A-Z]*') => {


                const key = join(relative(cwd(), join(_pkgDir, 'src')), name);

                return { components: `${key}.{js,jsx}` };
            };

            if (!obj.components) {
                obj.sections.push(makeComponent());
            } else if (Array.isArray(obj.components)) {
                obj.sections.push(...obj.components.map(makeComponent))
                delete obj.components;
            } else if (obj.components) {
                obj.sections.push(makeComponent(obj.components));
                delete obj.components;
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
        if (!opts.sections) {
            opts.sections = sections;
        } else {
            opts.sections = opts.sections.concat(sections);
        }
        return opts;
    };
    options                    = componentsToSections(options);

    if (options.styleguideComponents) {
        options.styleguideComponents =
            Object.keys(options.styleguideComponents).reduce((ret, key) => {
                ret[key] = enhancedResolve(options.styleguideComponents[key]);
                return ret;
            }, {});
    }
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

    const ret = sylist(conf, process.env.NODE_ENV);
   /* webpack.plugins.push(...ret.plugins);
    ret.entry.splice(0, 1, `${__dirname}/entry.js`);
    */webpack.entry = ret.entry;
    webpack.plugins.push(...ret.plugins);
    Object.assign(webpack.resolve.alias, ret.resolve.alias);
    (webpack.performance || (webpack.performance = {})).hints = false;

    return webpack;
};

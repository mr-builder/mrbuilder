const {findPlugin, findPreset} = require('@mrbuilder/plugin-babel/util');
const {asArray} = require('@mrbuilder/utils');

module.exports = function babelBabel({useModules, useDecorators = true, decoratorsBeforeExport = false}, conf) {

    if (useDecorators) {
        let decIndex = conf.plugins.findIndex(findPlugin('proposal-decorators'));
        let classPropIdx = conf.plugins.findIndex(findPlugin('proposal-class-properties'));
        if (decIndex < 0) {
            decIndex = conf.plugins.push(['@babel/plugin-proposal-decorators', {decoratorsBeforeExport}]) - 1;
        }
        if (classPropIdx < 0) {
            classPropIdx = decIndex + 1;
            conf.plugins.splice(classPropIdx, 0, '@babel/plugin-proposal-class-properties');
        }
        if (useDecorators === 'legacy') {

            const decoratorOptions = {
                ...(Array.isArray(conf.plugins[decIndex]) && conf.plugins[decIndex][1]),
                legacy: true
            }
            //Does not work with legacy... can't even be there
            delete decoratorOptions.decoratorsBeforeExport;
            const dec = conf.plugins[decIndex] = ['@babel/plugin-proposal-decorators', decoratorOptions];

            const props = conf.plugins[classPropIdx] = ['@babel/plugin-proposal-class-properties', {
                ...(Array.isArray(conf.plugins[classPropIdx]) && conf.plugins[classPropIdx][1]),
                loose: true
            }];

            if (classPropIdx < decIndex) {
                conf.plugins[classPropIdx] = dec;
                conf.plugins[decIndex] = props;
            }
        } else {
            const decPlugin = asArray(conf.plugins[decIndex] || ['@babel/plugin-proposal-decorators', {}]);

            conf.plugins[decIndex] = [decPlugin[0],
                {
                    decoratorsBeforeExport,
                    ...(decPlugin[1])
                }
            ];
        }

    }


    if (useModules) {
        this.info('allow exporting as ES6 modules');
        const idx = conf.presets.findIndex(findPreset('(?:env|2015)'));
        if (idx > -1) {
            const [, c = {}] = asArray(conf.presets[idx])
            c.modules = false;
            conf.presets[idx] = ['@babel/preset-env', {...c, modules: false}]
        } else {
            conf.presets.push(['@babel/preset-env', {modules: false}])
        }
    }

}
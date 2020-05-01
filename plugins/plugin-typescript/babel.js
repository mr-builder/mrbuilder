const {findPreset} = require('@mrbuilder/plugin-babel/util');

module.exports = function typescriptBabel({useBabel, isTSX = true, allExtensions = true}, conf) {
    const idx = conf.presets.findIndex(findPreset('typescript'))
    if (idx > -1) {
        conf.presets[idx] = ['@babel/preset-typescript', {
            ...(Array.isArray(conf.presets[idx]) ? conf.presets[idx][1] : {}),
            isTSX,
            allExtensions,
        }];
    } else {
        conf.presets.push(['@babel/preset-typescript', {
            isTSX,
            allExtensions,
        }]);
    }

}
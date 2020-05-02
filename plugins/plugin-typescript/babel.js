const {findPreset} = require('@mrbuilder/plugin-babel/util');

/**
 * So -- if you are using typescript and babel together and you don't have to set useBabel to true any longer.
 * If it is se to false, it will not load the preset.  If it is set to true, it will...
 *
 * @param useBabel
 * @param isTSX
 * @param allExtensions
 * @param conf
 */
module.exports = function typescriptBabel({useBabel, isTSX = true, allExtensions = true}, conf, om) {
    if (useBabel === false) {
        return;
    }
    if (!om.enabled('@mrbuilder/plugin-babel')){
        this.warn('useBabel is true, but babel is not enabled, this is probably not going to work.');
    }
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
const {findPreset} = require('@mrbuilder/plugin-babel/util');

module.exports = ({useBabel, isTSX = true, allExtensions = true}, conf, om) => {
    if (useBabel === false || !(om.enabled('@mrbuilder/plugin-jest') || om.enabled('@mrbuilder/plugin-mocha'))) {
        return;
    }
    if (!conf.presets.some(findPreset('typescript'))) {
        conf.presets.push(['@babel/preset-typescript', {
            isTSX,
            allExtensions,
        }]);
    }

}
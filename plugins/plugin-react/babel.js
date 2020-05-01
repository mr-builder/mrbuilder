const {findPlugin, findPreset} = require('@mrbuilder/plugin-babel/util');
module.exports = ({useClassDisplayName = true}, conf) => {
    if (useClassDisplayName) {
        if (!conf.plugins.find(findPlugin('babel-plugin-add-react-displayname'))) {
            conf.plugins.push('babel-plugin-add-react-displayname')
        }
    }
    if (!conf.presets.find(findPreset('react'))) {
        conf.presets.push('@babel/preset-react');
    }
    return conf;
}
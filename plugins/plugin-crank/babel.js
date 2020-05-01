const {findPreset} = require("@mrbuilder/plugin-babel/util");
module.exports = (options, conf) => {
    const reactPropIdx = conf.presets.find(findPreset('react'));
    if (reactPropIdx > -1) {
        conf.presets.splice(reactPropIdx, 1);
    }
    conf.presets.push('babel-preset-crank');
    return conf;
}
const {asArray} = require('@mrbuilder/utils');
const find = module.exports.find = (type, pname) => {
    const fn = (name) => {
        const re = new RegExp(`^(?:(?:@babel[/]|babel-)(?:${type}-))?${name}$`);
        return (v) => Array.isArray(v) ? re.test(v[0]) : re.test(v);
    };
    if (pname) {
        return fn(pname);
    }
    return fn;

}
module.exports.findPlugin = find('plugin');
module.exports.findPreset = find('preset');


const merge = module.exports.merge = function mergeBabel(babelConf, type, plugins) {
    for (const [name, conf] of plugins.map(asArray)) {
        const bIdx = babelConf[type].findIndex(find(type, name));
        if (bIdx > -1) {
            babelConf[type][bIdx] = conf == null ? name : [name, conf];
        } else {
            babelConf[type].push(conf == null ? name : [name, conf]);
        }
    }
    return babelConf;
}
const mergeBabelConf = module.exports.mergeBabelConf = function mergeBabelConf(babelConfig, mergeBabelConfig) {
    const {plugins, presets, ...rest} = mergeBabelConfig;
    plugins && merge(babelConfig, 'plugins', plugins);
    presets && merge(babelConfig, 'presets', presets);
    return Object.assign(babelConfig, rest);

}
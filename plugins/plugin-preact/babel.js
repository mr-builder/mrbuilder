const {findPreset} = require('@mrbuilder/plugin-babel/util');
const preact = {
    "pragma": "h",
    "pragmaFrag": "Fragment"
}

module.exports = (option, conf) => {
    const reactPropIdx = conf.presets.findIndex(findPreset(conf));
    if (reactPropIdx > -1) {
        this.info('using preact babel configuration');
        const r = Array.isArray(conf.presets[reactPropIdx]) ? conf.presets[reactPropIdx] : [conf.presets[reactPropIdx]];

        conf.presets[reactPropIdx] = [
            r[0],
            {
                ...r[1],
                ...preact,
            }
        ]
    } else {
        conf.presets.push(['@babel/preset-react', preact]);
    }
    return conf;
}
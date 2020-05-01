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

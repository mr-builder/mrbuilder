const path = require('path');

function _resolve(value) {
    try {
        return require.resolve(value);
    } catch (e) {
        return require.resolve(path.join(process.cwd(), 'node_modules', value));
    }
}


module.exports = function babelProcess(conf, resolve = _resolve) {

    const toAbs = (v) => (v.startsWith('./') || v.startsWith('/')) ? v : resolve(v);
    const fix = function (v) {
        if (Array.isArray(v)) {
            v[0] = toAbs(v[0]);
            return v;
        }
        return toAbs(v);
    };


    if (!conf.plugins) {
        conf.plugins = [];
    }
    if (!conf.presets) {
        conf.presets = [];
    }

    conf.plugins = conf.plugins.filter(Boolean).map(fix);
    conf.presets = conf.presets.filter(Boolean).map(fix);
    return conf;
};

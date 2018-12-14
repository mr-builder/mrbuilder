const path = require('path');

function _resolve(value) {
    try {
        return require.resolve(value);
    } catch (e) {
        return require.resolve(path.join(process.cwd(), 'node_modules', value));
    }
}


module.exports = function babelProcess(conf, resolve = _resolve, coverage) {

    const toAbs = (v) => (v.startsWith('./') || v.startsWith('/')) ? v : resolve(v);
    const fix   = function (v) {
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
//only needs to be set when using mocha,
    if (coverage) {
        conf.plugins.push([
            "istanbul",
            {
                "exclude": [
                    "**/test/*-test.js"
                ]
            }
        ]);
    }
    conf.plugins = conf.plugins.filter(Boolean).map(fix);
    conf.presets = conf.presets.filter(Boolean).map(fix);
    return conf;
};

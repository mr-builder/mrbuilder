const ctx = require.context('.', true, /\.js$/);

module.exports = ctx.keys().reduce((r, v) => {
    r[v] = ctx(v);
    return r;
}, {});
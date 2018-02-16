const emeth = require('emeth').default;
const ctx   = require.context('./', false, /\.stylm$/);

module.exports = emeth(ctx.keys().reduce((ret, key) => {
    ret[key.replace(/(?:.*\/)?(.+?)\.stylm$/, '$1')] = ctx(key);
    return ret;
}, {}));

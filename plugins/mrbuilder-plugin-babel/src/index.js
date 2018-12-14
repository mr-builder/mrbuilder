const babelVersion = require('../version');
module.exports = function (conf) {
    (this.info || console.log)('using babel version', babelVersion);
    return require(`mrbuilder-plugin-babel-${babelVersion}/src/index`).apply(this, arguments);
};

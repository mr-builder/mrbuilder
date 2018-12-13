module.exports = function (conf) {
    const {babelVersion = 6} = conf;
    (this.info || console.log)('using babel version', babelVersion);
    return require(`mrbuilder-plugin-babel-${babelVersion}/src/index`).apply(null, arguments);
};

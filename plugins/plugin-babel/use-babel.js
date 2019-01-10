const babelConfig = require('@mrbuilder/plugin-babel/babel-config');
/**
 * If your plugin needs its output to go through the babel compiler
 * use this.   It ensures that all babel options are consistent.
 *
 * @param om
 * @returns {{options}|{[p: string]: *}}
 */
module.exports = (om) => {
    let use;

    const mrb = (key, v) => om.config(`@mrbuilder/plugin-babel.${key}`, v);


    if (!use) {
        use = {...mrb('use')};
    }

    if (!use.loader) {
        use.loader = 'babel-loader';
    }
    if (!use.options) {
        use.options = babelConfig;
    }
    use.options          = {...use.options};
    const cacheDirectory = mrb('cacheDirectory', true);
    if (cacheDirectory) {
        use.options.cacheDirectory = cacheDirectory;
    }
    const cacheIdentifier = mrb('cacheIdentifier');
    if (cacheIdentifier) {
        use.options.cacheIdentifier = cacheIdentifier;
    }
    const cacheCompression = mrb('cacheCompression');
    if (cacheCompression) {
        use.options.cacheCompression = cacheCompression;
    }
    return use;
};

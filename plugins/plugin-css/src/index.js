const  {cssLoader, cssLoaderModule} = require('./cssLoader');
module.exports = function ({
                               test,
                               modules,
                           }, webpack, om) {
    return cssLoaderModule(webpack, modules === true ? /\.cssm$/ : modules, test, om);
};
module.exports.cssLoader = cssLoader;
module.exports.cssLoaderModule = cssLoaderModule;
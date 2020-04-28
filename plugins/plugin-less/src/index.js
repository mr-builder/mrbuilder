const {cssLoaderModule} = require('@mrbuilder/plugin-css');
module.exports = function ({
                               test,
                               options,
                               modules,
                           }, webpack, om) {


    return cssLoaderModule(webpack,  modules, test, om, {
        loader: 'less-loader',
        options
    });

};

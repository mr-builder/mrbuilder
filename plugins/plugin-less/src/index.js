const {cssLoaderModule} = require('@mrbuilder/plugin-css');
module.exports = function ({
                               test,
                               options,
                               modules,
                           }, webpack, om) {


    return cssLoaderModule(webpack, modules === true ? /[.]lessm/ : modules, test, om, {
        loader: 'less-loader',
        options
    });

};

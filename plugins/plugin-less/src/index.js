const {cssLoader} = require('@mrbuilder/plugin-css');
module.exports = function ({
                               test,
                               options,
                               modules,
                           }, webpack, om) {

    cssLoader(webpack, /\.less$/, modules, om, {
        loader: 'less-loader',
        options
    });

    if (modules) {
        cssLoader(webpack, modules === true ? /\.lessm$/ : modules, true, om, {
            loader: 'less-loader',
            options
        })
    }

    return webpack;
};

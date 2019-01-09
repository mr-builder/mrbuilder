const cssLoader = require('@mrbuilder/plugin-css/src/cssLoader');
module.exports  = function ({
                                test = /\.less$/,
                                options = {
                                    strictMath: true,
                                    noIeCompat: true
                                },
                                modules = true,
                            }, webpack, om) {

    cssLoader(webpack, /\.less$/, true, om, {
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

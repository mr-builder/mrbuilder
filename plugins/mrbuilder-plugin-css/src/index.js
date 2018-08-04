const cssLoader = require('./cssLoader');
module.exports  = function ({
                                isUseStyleLoader,
                                useNameHash,
                                publicPath = '/public',
                                css = true,
                                modules,
                            }, webpack, om) {

    if (css !== false) {
        cssLoader(webpack, css === true ? /\.css$/ : css, false, om);
    }
    if (modules !== false) {
        cssLoader(webpack, modules === true ? /\.cssm$/ : modules, true, om);
    }
    return webpack;
};

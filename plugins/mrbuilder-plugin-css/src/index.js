const cssLoader = require('./cssLoader');
module.exports  = function ({
                                isUseStyleLoader,
                                useNameHash,
                                publicPath = '/public',
                                css = true,
                                modules = false,
                            }, webpack) {

    if (css) {
        cssLoader(webpack, css === true ? /\.css/ : css, false)
    }
    if (modules) {
        cssLoader(webpack, modules === true ? /\.cssm$/ : modules, true)
    }
    return webpack;
};

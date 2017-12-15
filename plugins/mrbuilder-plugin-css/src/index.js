/**
 0 *   useCssModule     : {
        loader : "css-loader",
        options: {
            modules       : true,
            importLoaders : 1,
            localIdentName: SUBSCHEMA_LOCAL_IDENT,
        }
    },
 useCss           : {
        loader : "css-loader",
        options: {
            importLoaders: 1,
        }
    },
 * @param isUseStyleLoader
 * @param useNameHash
 * @param publicPath
 * @param css
 * @param webpack
 */
module.exports = function ({
                               isUseStyleLoader,
                               useNameHash,
                               publicPath = '/public',
                               modules = false,
                               autoprefixer = true,
                           }, webpack) {

    let useStyle;
    if (useNameHash == null) {
        if (this.useHtml) {
            useNameHash = '[hash].style.css';
        } else {
            useNameHash = 'style.css';
        }
    } else if (useNameHash === true) {
        useNameHash = '[hash].style.css';
    } else if (useNameHash === false) {
        useNameHash = 'style.css';
    }
    //So if its not turned on and its Karma than let's say that
    // we don't use it.
    if (isUseStyleLoader == null && !this.useHtml){
        isUseStyleLoader = true;
    }

    if (!isUseStyleLoader) {
        (this.info || console.log)('useNameHash', useNameHash);
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        const extractCSS        = new ExtractTextPlugin(useNameHash);

        useStyle = this.useStyle = function useStyleExtractText(...args) {
            const conf = { use: args.filter(Boolean) };
            if (publicPath) {
                conf.publicPath = publicPath;
            }
            return extractCSS.extract(conf);
        };

        webpack.plugins.push(extractCSS);
    } else {
        useStyle = this.useStyle = function useStyleWithStyleLoader(...args) {
            return ['style-loader'].concat(args.filter(Boolean));
        };
    }
    webpack.module.rules.push({
        test: /\.css$/,
        use : useStyle({
                loader : "css-loader",
                options: {
                    modules,
                    importLoaders: 1,
                }
            },
            autoprefixer && {
                loader : 'postcss-loader',
                options: {
                    plugins: [
                        require('autoprefixer')()
                    ]
                }
            }
        )
    });

    return webpack;
};

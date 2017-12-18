const babel = require('mrbuilder-plugin-babel/babel-config');
/**
 * {
        "extensions": {
          "es6": "javascript",
          "js": "javascript",
          "jsx": "javascript",
          "sh": "shell"
        },
        "theme": "atom-one-light",
        "highlighter": "hljs"
      }
 * @param test
 * @param include
 * @param exclude
 * @param extensions
 * @param webpack
 * @returns {*}
 extensions = {
                  'sh'  : 'shell',
                  'js'  : 'javascript',
                  'es6' : 'javascript',
                  'jsx' : 'javascript',
                  'css' : 'stylesheets',
                  'less': 'less',
                  'styl': 'stylus'
              },
 highlighter = 'hljs',
 theme = 'atom-one-light'
 */
const omit  = (obj, keys) => {
    if (!obj) {
        return obj;
    }
    return Object.keys(obj).reduce(function (ret, key) {
        if (keys.includes(key)) {
            return ret;
        }
        ret[key] = obj[key];
        return ret;
    }, {});
};

module.exports = function (conf = {},
                           webpack) {
    const {
              test = /\.md$/,
              include,
              exclude,
          } = conf;

    const options = Object.assign({
        extensions : {
            'sh'  : 'shell',
            'js'  : 'javascript',
            'es6' : 'javascript',
            'jsx' : 'javascript',
            'css' : 'stylesheets',
            'less': 'less',
            'styl': 'stylus'
        },
        highlighter: 'hljs',
        theme      : 'atom-one-light',
        html       : true,
    }, omit(conf, ['test', 'include', 'exclude']));


    webpack.module.rules.push(
        {
            test,
            include,
            exclude,
            use: [{
                loader : 'babel-loader',
                options: babel
            }, {
                loader: require.resolve('./markdown-loader'),
                options
            }]
        });
    return webpack;
}
;

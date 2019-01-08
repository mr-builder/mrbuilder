const useBabel = require('mrbuilder-plugin-babel/use-babel');
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
const omit     = (obj, keys) => {
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
                           webpack, om) {
    const {
              test = /\.md$/,
              include,
              exclude,
          } = conf;

    const options = Object.assign({
        extensions     : {
            'sh'  : 'shell',
            'js'  : 'javascript',
            'es6' : 'javascript',
            'jsx' : 'javascript',
            'css' : 'stylesheets',
            'less': 'less',
            'styl': 'stylus'
        },
        highlighter    : 'hljs',
        theme          : 'atom-one-light',
        html           : true,
        markdownPlugins: ['markdown-it-checkbox']
    }, omit(conf, ['test', 'include', 'exclude']));


    webpack.module.rules.push(
        {
            test,
            include,
            exclude,
            use: [
                useBabel(om),
                {
                    loader: require.resolve('./markdown-loader'),
                    options
                }]
        });
    return webpack;
}
;

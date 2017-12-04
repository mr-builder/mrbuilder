'use strict';

var babel = require('mrbuilder-plugin-babel/babel-config');
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
 */
module.exports = function (_ref, webpack) {
    var _ref$test = _ref.test,
        test = _ref$test === undefined ? /\.md$/ : _ref$test,
        include = _ref.include,
        exclude = _ref.exclude,
        _ref$extensions = _ref.extensions,
        extensions = _ref$extensions === undefined ? {
        'sh': 'shell',
        'js': 'javascript',
        'es6': 'javascript',
        'jsx': 'javascript',
        'css': 'stylesheets',
        'less': 'less',
        'styl': 'stylus'
    } : _ref$extensions,
        _ref$highlighter = _ref.highlighter,
        highlighter = _ref$highlighter === undefined ? 'hljs' : _ref$highlighter,
        _ref$theme = _ref.theme,
        theme = _ref$theme === undefined ? 'atom-one-light' : _ref$theme;

    webpack.module.rules.push({
        test: test,
        include: include,
        exclude: exclude,
        use: [{
            loader: 'babel-loader',
            options: babel
        }, {
            loader: require.resolve('./markdown-loader'),
            options: {
                extensions: extensions,
                highlighter: highlighter,
                theme: theme
            }
        }]
    });
    return webpack;
};
//# sourceMappingURL=index.js.map
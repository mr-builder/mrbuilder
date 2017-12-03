'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _markdown = require('./markdown');

var _markdown2 = _interopRequireDefault(_markdown);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = function stringify(str) {
    if (str == null) {
        return '';
    }

    return (0, _stringify2.default)(str);
};

//cache this thing;
var md = void 0;

module.exports = function (source) {

    if (!md) {
        var langMap = this.query.extensions;
        var highlighter = this.query.highlighter;
        var theme = this.query.theme;
        var renderer = new _markdown2.default();

        md = (0, _markdownIt2.default)({
            xhtmlOut: true,
            highlight: function highlight(str, lang) {
                lang = lang && lang.trim() || 'text';

                var lng = langMap[lang] || lang;
                var resolvedLang = 'react-syntax-highlighter/languages/' + highlighter + '/' + lng;
                var resolved = false;
                try {
                    require.resolve(resolvedLang);
                    resolved = true;
                } catch (e) {
                    console.log('no language highlighting for ' + resolvedLang);
                }

                if (!resolved) {
                    return '<code className="unknown-lang lang-' + (lang || 'nolang') + '">{' + (0, _stringify2.default)(str) + '}</code>';
                }
                renderer.imports['MDhighlighter$, { registerLanguage  as $mdRl} '] = 'react-syntax-highlighter/light';
                renderer.imports['$mdLang'] = resolvedLang;
                renderer.imports['$mdStyle'] = 'react-syntax-highlighter/styles/' + highlighter + '/' + theme;

                renderer.prelude['$mdRl(' + stringify(lng) + ', $mdLang);\n'] = true;

                return '<MDhighlighter$ style={$mdStyle} language={' + stringify(lng) + '}>{' + stringify(str.trim()) + '}</MDhighlighter$>'; // use
                // external
                // default
                // escaping
            }
        });

        md.renderer = renderer;
    }
    this.cacheable && this.cacheable();
    return md.render(source);
};
//# sourceMappingURL=babel-config.js.map

const Renderer   = require('./markdown');
const MarkdownIt = require('markdown-it');

const stringify = (str) => {
    if (str == null) {
        return '';
    }

    return JSON.stringify(str);
};

//cache this thing;
let md;
/**
 *   html:         false,        // Enable HTML tags in source
 xhtmlOut:     false,        // Use '/' to close single tags (<br />).
 // This is only for full CommonMark compatibility.
 breaks:       false,        // Convert '\n' in paragraphs into <br>
 langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
 // useful for external highlighters.
 linkify:      false,        // Autoconvert URL-like text to links

 // Enable some language-neutral replacement + quotes beautification
 typographer:  false,

 // Double + single quotes replacement pairs, when typographer enabled,
 // and smartquotes on. Could be either a String or an Array.
 //
 // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
 // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
 quotes: '“”‘’',

 * @param source
 * @returns {*}
 */
module.exports = function (source) {


    if (!md) {
        const langMap         = this.query.extensions;
        const highlighter     = this.query.highlighter;
        const theme           = this.query.theme;
        const xhtmlOut        = this.query.xhtmlOut || true;
        const linkify         = this.query.linkify;
        const typographer     = this.query.typographer;
        const quotes          = this.query.quotes;
        const markdownPlugins = this.query.markdownPlugins;
        const html             =this.query.html || true;
        const renderer        = new Renderer();
        md = MarkdownIt({
            xhtmlOut,
            linkify,
            typographer,
            quotes,
            html,
            highlight: function (str, lang) {
                lang = lang && lang.trim() || 'text';


                const lng          = langMap[lang] || lang;
                const resolvedLang = `react-syntax-highlighter/languages/${highlighter}/${lng}`;
                let resolved       = false;
                try {
                    require.resolve(resolvedLang);
                    resolved = true;
                } catch (e) {
                    console.log(`no language highlighting for ${resolvedLang}`);
                }

                if (!resolved) {
                    return `<code className="unknown-lang lang-${lang
                                                                 || 'nolang'}">{${JSON.stringify(
                        str)}}</code>`;
                }
                renderer.imports['MDhighlighter$, { registerLanguage  as $mdRl} '] =
                    'react-syntax-highlighter/light';
                renderer.imports['$mdLang']                                        =
                    resolvedLang;
                renderer.imports['$mdStyle']                                       =
                    `react-syntax-highlighter/styles/${highlighter}/${theme}`;

                renderer.prelude[`$mdRl(${stringify(lng)}, $mdLang);\n`] = true;

                return `<MDhighlighter$ style={$mdStyle} language={${stringify(
                    lng)}}>{${stringify(str.trim())}}</MDhighlighter$>`; // use
                                                                         // external
                                                                         // default
                                                                         // escaping
            }
        });

        if (markdownPlugins) {
            markdownPlugins.forEach(value => {
                if (Array.isArray(value)) {
                    md = md.use(require(value[0]), value[1]);
                } else {
                    md = md.use(require(value));
                }
            })
        }
        md.renderer = renderer;
    }
    this.cacheable && this.cacheable();
    return md.render(source);
};

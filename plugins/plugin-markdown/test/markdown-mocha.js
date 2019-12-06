const loader = require('../src/markdown-loader');

describe('@mrbuilder/plugin-markdown/mocha', function () {

    it('should render inline', function () {
        console.log(loader.call({
            query: {
                extensions: {
                    'sh': 'shell',
                    'js': 'javascript',
                    'es6': 'javascript',
                    'jsx': 'javascript',
                    'css': 'stylesheets',
                    'less': 'less',
                    'styl': 'stylus'
                },
                highlighter: 'hljs',
                theme: 'atom-one-light',
                html: true,
            }
        }, '## hello\n <Word style="color:red;font-size:14px">hello</Word>'));
    });

    it('should render fixture/inline', function () {
        const out = loader.call({
            query: {
                extensions: {
                    'sh': 'shell',
                    'js': 'javascript',
                    'es6': 'javascript',
                    'jsx': 'javascript',
                    'css': 'stylesheets',
                    'less': 'less',
                    'styl': 'stylus'
                },
                highlighter: 'hljs',
                theme: 'atom-one-light',
                html: true,
            }
        }, require('!raw-loader!!./fixture/inline.md').default);
        console.log(out);
    });

    it('should render fixture/meta', function () {
        const out = loader.call({
            query: {
                extensions: {
                    'sh': 'shell',
                    'js': 'javascript',
                    'es6': 'javascript',
                    'jsx': 'javascript',
                    'css': 'stylesheets',
                    'less': 'less',
                    'styl': 'stylus'
                },
                highlighter: 'hljs',
                theme: 'atom-one-light',
                html: true,
            }
        }, require('!raw-loader!!./fixture/meta.md').default);
        console.log(out);
    });
});

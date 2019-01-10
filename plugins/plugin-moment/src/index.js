const { ContextReplacementPlugin } = require('webpack');

function momentPlugin({ languages = ['en'], alias = true }, webpack) {
    languages = Array.isArray(languages) ? languages : [languages];
    if (alias) {
        if (alias === true) {
            webpack.resolve.alias['moment'] = require.resolve('moment')
        } else {
            webpack.resolve.alias['moment'] = alias;
        }
    }
    const langs = languages instanceof RegExp ? languages : new RegExp(languages.join('|'));
    (this.info || console.log)('using ', langs+'');
    webpack.plugins.push(
        new ContextReplacementPlugin( /moment\/locale$/,
            langs));
    return webpack;
}

module.exports = momentPlugin;

const { resolve } = require('path')

function momentPlugin({ languages = ['en'], alias = true }, webpack) {
    languages = Array.isArray(languages) ? languages : [languages];
    if (alias) {
        if (alias === true) {
            webpack.resolve.alias['moment'] =
                resolve(require.resolve('moment/package.json'), '..')
        } else {
            webpack.resolve.alias['moment'] = alias;
        }
    }
    webpack.plugins.push(
        new this.webpack.ContextReplacementPlugin(/moment[\/\\]locale$/,
            new RegExp(languages.join('|'))));
    return webpack;
}

module.exports = momentPlugin;

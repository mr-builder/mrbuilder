const {Info} = require('@mrbuilder/cli');

module.exports = function ({emitCss, hotReload}, webpack, optionsManager) {
    if (!webpack.resolve.alias) {
        webpack.resolve.alias = {};
    }
    if (!webpack.resolve.alias.svelte) {
        webpack.resolve.alias['svelte/internal'] = require.resolve('svelte/internal')

        webpack.resolve.alias.svelte = require.resolve('svelte')
    }
    webpack.resolve.extensions.push('.svelte');

    webpack.module.rules.push({
        test: /[.]svelte$/,
        use: {
            loader: require.resolve('svelte-loader'),
            options: {
                emitCss: (emitCss == null ? true : emitCss),
                hotReload: hotReload === null ? Info.isDevServer : hotReload,
            }
        }
    });
    return webpack;
}

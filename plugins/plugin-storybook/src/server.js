const {optionsManager} = require('@mrbuilder/cli');
const {enhancedResolve, asArray} = require('@mrbuilder/utils');
const isDevServer = optionsManager.config('@mrbuilder/plugin-storybook.isDevServer');

if (isDevServer) {
    process.env.NODE_ENV = 'development';
}

const server = require("@storybook/core/server");

const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-storybook.${key}`, def);

const options = require(`@storybook/${mrb('type', 'react')}/dist/server/options`).default;

const serverOptions = {
    ...options,
    frameworkPresets: ['@mrbuilder/plugin-storybook/register', ...asArray(mrb('frameworkPresets', []))],
    configDir: mrb('configDir', optionsManager.cwd('.storybook')),
    staticDir: mrb('staticDir', asArray(mrb('staticDir', optionsManager.config('@mrbuilder/cli.publicDir', optionsManager.cwd('public'))))),
    ...([
        'port',
        'host',
        'sslCa',
        'sslCert',
        'sslKey',
        'dll',
        'ci',
        'smokeTest',
        'quiet',
        'host',
        'ignorePreview',
        'docs',
        'previewUrl',

    ].reduce((r, k) => {
        r[k] = mrb(k, r[k]);
        return r;
    }, {})),
};
if (!isDevServer) {
    serverOptions.outputDir = enhancedResolve(mrb('outputDir', 'storybook-static'));
}
server[isDevServer ? 'buildDev' : 'buildStatic'](serverOptions);
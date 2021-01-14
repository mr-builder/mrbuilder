const {optionsManager, Info}     = require('@mrbuilder/cli');
const {enhancedResolve, asArray} = require('@mrbuilder/utils');
const fs                         = require('fs');
const path                       = require('path');
const server                     = require("@storybook/core/server");

if (Info.isDevServer) {
    process.env.NODE_ENV = 'development';
}


const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-storybook.${key}`, def);

const options = require(`@storybook/${mrb('type', 'react')}/dist/server/options`).default;

const serverOptions = {
    ...options,
    frameworkPresets: ['@mrbuilder/plugin-storybook/register', ...asArray(mrb('frameworkPresets', []))],
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
if (!Info.isDevServer) {
    serverOptions.outputDir = enhancedResolve(mrb('outputDir', 'storybook-static'));
}
const staticDir = mrb('staticDir', mrb('staticDir', optionsManager.config('@mrbuilder/cli.publicDir', optionsManager.cwd('public'))));
const configDir = mrb('configDir')

if (staticDir && fs.existsSync(staticDir)) {
    serverOptions.staticDir = staticDir;
}

const defaultStorybook = `${process.cwd()}/.storybook`;

serverOptions.configDir = configDir ? enhancedResolve(configDir)
    : fs.existsSync(defaultStorybook) ? defaultStorybook : path.join(__dirname, '..', 'config');

server[Info.isDevServer ? 'buildDev' : 'buildStatic'](serverOptions);
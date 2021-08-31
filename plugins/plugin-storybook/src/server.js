const { optionsManager, Info } = require('@mrbuilder/cli');
const { enhancedResolve, asArray } = require('@mrbuilder/utils');
const fs = require('fs');
const path = require('path');
const server = require("@storybook/core/server");
const { isPropertyAccessChain } = require('typescript');

if (Info.isDevServer) {
    process.env.NODE_ENV = 'development';
}

const tryRequire = (...places) => {
    for (const loc of places) {
        try {
            const res = require(loc);
            if (res) {
                return res.default || res;
            }
        } catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
        }
    }
}

const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-storybook.${key}`, def);

const options = tryRequire(`@storybook/${mrb('type', 'react')}/dist/server/options`, `@storybook/${mrb('type', 'react')}/dist/cjs/server/options`);

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
    serverOptions.outputDir = enhancedResolve(mrb('outputDir', optionsManager.config('@mrbuilder/cli.outputDir', 'storybook-static')));
}
const staticDir = mrb('staticDir', mrb('staticDir', optionsManager.config('@mrbuilder/cli.publicDir', optionsManager.cwd('public'))));
const configDir = mrb('configDir')

if (staticDir && fs.existsSync(staticDir)) {
    serverOptions.staticDir = staticDir;
}

const defaultStorybook = `${process.cwd()}/.storybook`;

serverOptions.configDir = configDir ? enhancedResolve(configDir)
    : fs.existsSync(defaultStorybook) ? defaultStorybook : path.join(__dirname, '..', 'config');

    //Fix with issue of configDir not getting picked up correctly by storybook.
if (!process.argv.includes('--config-dir', 2)) {
    process.argv.splice(2, 0, '--config-dir', serverOptions.configDir);
}

server[Info.isDevServer ? 'buildDev' : 'buildStatic'](serverOptions);
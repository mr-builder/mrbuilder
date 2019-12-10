const server = require("@storybook/core/server");
const om = require('@mrbuilder/cli').default;
const path = require('path');
const config = (key, def) => om.config(`@mrbuilder/plugin-storybook.${key}`, def);
const staticDir = om.config('@mrbuilder/cli.publicDir', om.cwd('public'));
const options = require(`@storybook/${config('type', 'react')}/dist/server/options`).default;

server[om.config('@mrbuilder/plugin-storybook.isDevServer') ? 'buildDev' : 'buildStatic']({
    ...options,
    outputDir: config('outputDir'),
    configDir: config('configDir', path.join(__dirname, 'config')),
    staticDir: config('staticDir', Array.isArray(staticDir) ? staticDir : staticDir ? [staticDir] : null),
    ...[
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
        'frameworkPresets',
        'previewUrl',

    ].reduce((r, k) => {
        const v = config(k);
        if (v != null) {
            r[k] = config(k);
        }
        return r;
    }, {}),
});
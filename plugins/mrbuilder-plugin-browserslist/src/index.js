const { cwd }        = require('mrbuilder-utils');
const path           = require('path');
const { env }        = process;
const { existsSync } = require('fs');


if (env.BROWSERSLIST_CONFIG) {
    env.BROWSERSLIST_CONFIG = cwd(env.BROWSERSLIST_CONFIG);
} else if (!(env.BROWSERSLIST_CONFIG || env.BROWSERSLIST)) {
    const dotBrowsers       = cwd('.browserslistrc');
    env.BROWSERSLIST_CONFIG =
        existsSync(dotBrowsers) ? dotBrowsers : path.resolve(__dirname, '..',
            'browserslist');
}
module.exports = ()=>{};

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
} else {

    const optionsManager = global._MRBUILDER_OPTIONS_MANAGER;
    if (optionsManager.config('mrbuilder-plugin-browserslist.browserslist')) {
        process.env.BROWSERSLIST =
            optionsManager.config('mrbuilder-plugin-browserslist.browserslist');
    } else if (optionsManager.config('mrbuilder-plugin-browserslist.file')) {
        env.BROWSERSLIST_CONFIG =
            optionsManager.config('mrbuilder-plugin-browserslist.file')
    }
}

module.exports = function (options, webpack) {

};

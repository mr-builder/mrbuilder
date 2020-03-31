const {enhancedResolve} = require('@mrbuilder/utils');
const path = require('path');
const {env} = process;
const {existsSync} = require('fs');
const optionsManager = require('@mrbuilder/cli').default;
if (optionsManager.enabled('@mrbuilder/plugin-browserslist')) {
    if (!(env.BROWSERSLIST_CONFIG || env.BROWSERSLIST)) {
        if (optionsManager.config('@mrbuilder/plugin-browserslist.browserslist')) {
            env.BROWSERSLIST = optionsManager.config('@mrbuilder/plugin-browserslist.browserslist');
            optionsManager.logger('@mrbuilder/plugin-browserslist').info(`using ${env.BROWSERSLIST}`)
        } else if (optionsManager.config('@mrbuilder/plugin-browserslist.file')) {
            env.BROWSERSLIST_CONFIG = enhancedResolve(optionsManager.config('@mrbuilder/plugin-browserslist.file'));
            optionsManager.logger('@mrbuilder/plugin-browserslist').info(`using config ${env.BROWSERSLIST_CONFIG}`)
        } else {
            const dotBrowsers = optionsManager.cwd('.browserslistrc');
            env.BROWSERSLIST_CONFIG = existsSync(dotBrowsers) ? dotBrowsers : path.resolve(__dirname, '..', 'browserslist');
        }
    }
}
module.exports = () => {
};

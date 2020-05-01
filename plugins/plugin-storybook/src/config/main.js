const {optionsManager} = require('@mrbuilder/cli');
const {enhancedResolve} = require('@mrbuilder/utils');
const {resolve} = require('path');
const {existsSync} = require('fs');
const customPresets = optionsManager.cwd('.storybook', 'presets.js');
const resolver = (v) => enhancedResolve(v, optionsManager.require);

const asArray = v => Array.isArray(v) ? v : v == null ? [] : [v];
const logger = optionsManager.logger('@mrbuilder/plugin-storybook');
logger.debug('main.js found');

const stories = [

    ...asArray(optionsManager.config('@mrbuilder/plugin-storybook.stories', []))
        .filter(Boolean).map(v => optionsManager.cwd(v))
]
logger.debug('stories', stories);

const presets = [
    '@mrbuilder/plugin-storybook/register',
    ...optionsManager.config('@mrbuilder/plugin-storybook.presets', []).map(resolver),
    existsSync(customPresets) && customPresets,
].filter(Boolean)

logger.debug('presets', presets);

module.exports = {
    entries: [resolve(__dirname, '..', 'stories.js')],
    stories,
    presets
}
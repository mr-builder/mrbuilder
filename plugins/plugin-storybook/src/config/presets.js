const fs = require('fs');
const om = require('@mrbuilder/cli').default;
const customPresets = om.cwd('.storybook', 'presets.js');
const path = require('path');
module.exports = [
    path.resolve(__dirname, '../mrbuilder-storybook-preset'),
    ...om.config('@mrbuilder/plugin-storybook.presets', []),
    fs.existsSync(customPresets) && customPresets,
].filter(Boolean).map(v => om.require.resolve(v));
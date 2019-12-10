const om = require('@mrbuilder/cli').default;
const path = require('path');

if (!om.enabled('@mrbuilder/plugin-react')) {
    throw `currently on react is supported, please enable or submit a PR for other storybook presets`

}
require('../src/server');

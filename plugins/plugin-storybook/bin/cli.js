const om = require('@mrbuilder/cli').default;
const path = require('path');
if (!om.enabled('@mrbuilder/plugin-react')) {
    throw `currently on react is supported, please enable or submit a PR for other storybook presets`

}


const script = `@storybook/react/bin/${om.config('@mrbuilder/plugin-storybook.isDevServer') ? 'index' : 'build'}`


if (!(process.argv.includes('-c', 2) || process.argv.includes('--config-dir', 2))) {
    const config = path.join(__dirname, '..', 'src', 'config');
    om.info('using', config);
    process.argv.push('--config-dir', config);
}
om.info(`using ${script}`)
require(script);

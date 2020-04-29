const {optionsManager} = require("@mrbuilder/cli");
const {env} = process;
env.MRBUILDER_PLUGINS = `@mrbuilder/plugin-dashboard`;
const mrb = (key, d) => optionsManager.config(`@mrbuilder/plugin-dashboard.${key}`, d);
const argv = process.argv;
argv.push('-p', mrb('port', '3001'));
argv.push('-a', mrb('includeAssets', ['public']));
mrb('minimal') && argv.push('-m');
mrb('title') && argv.push('-t', mrb('title'))
mrb('color') && argv.push('-c', mrb('color'));
argv.push('--');
argv.push(mrb('command', process.env.npm_execpath || 'yarn'));
argv.push('run');
argv.push(mrb('script', 'start'));
console.log('argv',argv);

require('webpack-dashboard/bin/webpack-dashboard')({});

#!/usr/bin/env node
const {env} = process;
env.MRBUILDER_INTERNAL_PLUGINS =
    [env.MRBUILDER_INTERNAL_PLUGINS, 'mrbuilder-plugin-browserslist', 'mrbuilder-plugin-babel', 'mrbuilder-plugin-webpack', 'mrbuilder-plugin-karma', 'mrbuilder-plugin-enzyme'].join(
        ',');

if (!env.NODE_ENV) {
    env.NODE_ENV = 'test';
}
global._MRBUILDER_OPTIONS_MANAGER || (global._MRBUILDER_OPTIONS_MANAGER =
    new (require('mrbuilder-optionsmanager').default)(
        { prefix: 'mrbuilder', _require: require }));

require('mrbuilder-plugin-karma/bin/cli');

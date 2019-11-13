#!/usr/bin/env node
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
if (process.argv.length === 2) {
    process.argv.push('./lib');
}
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    throw new Error('Please call from the mrbuilder script');
}

if (global._MRBUILDER_OPTIONS_MANAGER.enabled('@mrbuilder/plugin-clean')) {


    const conf = global._MRBUILDER_OPTIONS_MANAGER.config("@mrbuilder/plugin-clean");
    console.log('conf', conf);
    if (conf) {
        /**
         * | paths         | array      | outputPath   | The directories to
         * clean
         *   |
         | root          | string     | $CWD         | The Root directory               |
         | verbose       | bool       | false        | Be verbose                       |
         | allowExternal | bool       | false        | Allow external directory deletion|
         | dry           | bool       | false        | Dry run                          |
         | exclude       | [string]   |              | Paths to exclude                 |
         * @type {string[]}
         */
        const cleanOptions = Object.assign({root: process.cwd(), dangerouslyAllowCleanPatternsOutsideProject:conf.allowExternal, dry:conf.dry, }, conf);
        const clean = new CleanWebpackPlugin(cleanOptions);
        clean.removeFiles(process.argv.slice(2));
    }
}

#!/usr/bin/env node
process.env.NODE_ENV                   = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-plugin-mocha';


const optionsManager = global._MRBUILDER_OPTIONS_MANAGER || (
    global._MRBUILDER_OPTIONS_MANAGER =
        new (require('mrbuilder-optionsmanager').default)({
            prefix  : 'mrbuilder',
            _require: require
        }));

const { cwd }  = require('mrbuilder-utils');
const path     = require('path');
const { argv } = process;
const { info } = optionsManager.plugins.get('mrbuilder-plugin-mocha');

const coverageDir    = optionsManager.config(
    'mrbuilder-plugin-mocha.coverageDir');
const coverageGLobal = optionsManager.config(
    'mrbuilder-plugin-mocha.coverageGLobal');
const testDir        = optionsManager.config('mrbuilder-plugin-mocha.testDir',
    cwd('test'));
const filePattern    = optionsManager.config(
    'mrbuilder-plugin-mocha.filePattern', '**/*-test.js');
const timeout        = optionsManager.config('mrbuilder-plugin-mocha.timeout',
    20000);

info(`running tests '${testDir}/${filePattern}'`);

let mocha;
try {
    mocha = require.resolve('mocha/bin/_mocha');
} catch (e) {
    mocha = `${__dirname}/../node_modules/mocha/bin/_mocha`;
}

if (coverageDir || coverageGLobal) {

    let coverage = coverageDir || cwd('coverage');

    argv.splice(2, 0, '--source-map=false', `--report-dir=${coverage}`,
        `--reporter=json`, `--instrument=false`, '--all',
        '--include=src/**/*.js', mocha);
    mocha = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nyc');
} else {
    argv.push('--require', require.resolve('babel-polyfill'));
}
if (timeout) {
    argv.push('--timeout', timeout);
}
argv.push('--require',
    require.resolve('mrbuilder-plugin-babel/babel-register'));

if (optionsManager.enabled('mrbuilder-plugin-enzyme')) {
    argv.push('--require', path.join(__dirname, '..', 'src', 'cli-helpers'));
    argv.push('--require', 'mrbuilder-plugin-enzyme/src/enzyme');
}

argv.push(testDir);
argv.push(filePattern);

optionsManager.plugins.get('mrbuilder-plugin-mocha')
              .debug(`[mrbuilder-mocha] running with args `, argv);

require(mocha);

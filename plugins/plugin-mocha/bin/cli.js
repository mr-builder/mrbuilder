#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PLUGINS =
        `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-enzyme,@mrbuilder/plugin-mocha`;
    global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').OptionsManager)({
        prefix: 'mrbuilder',
        _require: require
    });
}

const om = global._MRBUILDER_OPTIONS_MANAGER;
const {cwd} = require('@mrbuilder/utils');
const path = require('path');
const {argv} = process;
const {info} = om.logger('@mrbuilder/plugin-mocha');

const coverageDir = om.config('@mrbuilder/plugin-mocha.coverageDir');
const coverageGLobal = om.config('@mrbuilder/plugin-mocha.coverageGlobal');
const testDir = om.config('@mrbuilder/plugin-mocha.testDir', cwd('test'));
const filePattern = om.config('@mrbuilder/plugin-mocha.filePattern', '**/*-test.js');
const timeout = om.config('@mrbuilder/plugin-mocha.timeout', 20000);
const useBabel = om.config('@mrbuilder/plugin-mocha.useBabel', om.enabled('@mrbuilder/plugin-babel'));
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
    if (useBabel) {
        argv.push('--require', require.resolve('@mrbuilder/plugin-babel/babel-polyfill'));
    }
}

if (timeout) {
    //argv is all strings
    argv.push('--timeout', '' + timeout);
}

if (useBabel) {
    argv.push('--require', require.resolve('@mrbuilder/plugin-babel/babel-register'));
}

if (om.enabled('@mrbuilder/plugin-enzyme')) {
    argv.push('--require', path.join(__dirname, '..', 'src', 'cli-helpers'));
    argv.push('--require', '@mrbuilder/plugin-enzyme/src/enzyme-mocha');
}

argv.push(testDir + '/' + filePattern);

om.plugins.get('@mrbuilder/plugin-mocha').debug(`[@mrbuilder/mocha] running with args `, argv);

require(mocha);

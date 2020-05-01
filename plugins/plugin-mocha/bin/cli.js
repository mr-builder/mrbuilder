#!/usr/bin/env node
const {argv, env} = process;
env.NODE_ENV = env.NODE_ENV || 'test';
env.MRBUILDER_INTERNAL_PLUGINS = `${env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/cli,@mrbuilder/plugin-mocha`;


const {optionsManager} = require('@mrbuilder/cli');
const path = require('path');
const {info} = optionsManager.logger('@mrbuilder/plugin-mocha');
const mrb = (key, def) => optionsManager.config('@mrbuilder/plugin-mocha' + (key ? `.${key}` : ''), def);
const coverageDir = mrb('coverageDir');
const coverageGLobal = mrb('coverageGlobal');
const testDir = mrb('testDir', optionsManager.cwd(optionsManager.config('@mrbuilder/cli.testDir')));
const filePattern = mrb('filePattern', '**/*-test.js');
const timeout = mrb('timeout', 20000);
const useBabel = mrb('useBabel', optionsManager.enabled('@mrbuilder/plugin-babel') || optionsManager.config('@mrbuilder/plugin-typescript.useBabel'));
info(`running tests '${testDir}/${filePattern}'`);

let mocha;
try {
    mocha = require.resolve('mocha/bin/_mocha');
} catch (e) {
    mocha = `${__dirname}/../node_modules/mocha/bin/_mocha`;
}

if (coverageDir || coverageGLobal) {

    let coverage = coverageDir || optionsManager.cwd('coverage');

    argv.splice(2, 0, '--source-map=false', `--report-dir=${coverage}`,
        `--reporter=json`, `--instrument=false`, '--all',
        '--include=src/**/*.js', mocha);
    mocha = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nyc');
}

if (timeout) {
    //argv is all strings
    argv.push('--timeout', '' + timeout);
}

if (useBabel) {
    argv.push('--require', require.resolve('@mrbuilder/plugin-babel/babel-register'));
}

if (optionsManager.enabled('@mrbuilder/plugin-enzyme')) {
    argv.push('--require', path.resolve(__dirname, '../src', 'cli-helpers.js'));
    argv.push('--require', require.resolve('@mrbuilder/plugin-enzyme/enzyme-mocha'));
}

argv.push(testDir + '/' + filePattern);


optionsManager.logger("@mrbuilder/plugin-mocha").info(`running with args `, argv.join('\\\n'));

require(mocha);

import {mergeArgs, mergeEnv} from '../src/util';
import {expect} from 'chai';
import 'mocha';

const argv = (...args: string[]): string[] => [null, null, ...args];

describe('@mrbuilder/optionsmanager/util', function () {
    describe('mergeArgs', function () {
        it('should parse  arg', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--tester-my-plugin.stuff', '1'))).to.eql({stuff: 1});
        });

        it('should parse  arg with = ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--tester-my-plugin.stuff=1'))).to.eql({stuff: 1});
        });


        it('should parse arg false ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--tester-my-plugin', 'false'))).to.eql(false);
        });

        it('should parse scoped arg with=false ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--@tester/my-plugin=false'))).to.eql(false);
        });

        it('should parse scoped arg', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--@tester/my-plugin.stuff', '1'))).to.eql({stuff: 1});
        });

        it('should parse scoped arg with = ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--@tester/my-plugin.stuff=1'))).to.eql({stuff: 1});
        });

        it('should parse deep scoped arg with = ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--@tester/my-plugin.stuff.what=1'))).to.eql({stuff: {what: 1}});
        });

        it('should parse camelCase scoped arg with = ', () => {
            expect(mergeArgs('@tester/my-plugin', argv('--@tester/my-plugin.stuff-what=1'))).to.eql({stuffWhat: 1});
        });
    });
    describe('mergeEnv', function () {

        it('should parse env', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN_STUFF: '1'})).to.eql({});
        });

        it('should parse env with true', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN: '1'})).to.eql(true);
        });

        it('should parse env with false', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN: '0'})).to.eql(false);
        });

        it('should parse env with "false"', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN: "false"})).to.eql(false);
        });

        it('should parse env with "true"', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN: "true"})).to.eql(true);
        });

        it('should parse env with obj', () => {
            expect(mergeEnv('@tester/my-plugin', {TESTER_MY_PLUGIN: JSON.stringify({"stuff": 1})})).to.eql({stuff: 1});
        });
        it('should parse env with __ obj', () => {
            expect(mergeEnv('@tester/my-plugin', { TESTER_MY_PLUGIN__STUFF: '1' })).to.eql({ stuff: 1 });
        });
        it('should parse env with __ nested obj', () => {
            expect(mergeEnv('@tester/my-plugin', { TESTER_MY_PLUGIN__STUFF__WHAT: '1' })).to.eql({ stuff: { what: 1 } });
        });
        it('should parse env with _ camelCase nested obj', () => {
            expect(mergeEnv('@tester/my-plugin', { TESTER_MY_PLUGIN__STUFF_WHAT: '1' })).to.eql({ stuffWhat: 1 });
        });
    });
});
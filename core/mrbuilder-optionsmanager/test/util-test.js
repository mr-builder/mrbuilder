import { mergeAlias, parse } from '../src/util';
import { expect } from 'chai';

describe('mrbuilder-optionsmanager/util', function () {

    const _argv = (...argv) => ['ignore-first', 'ignore-second'].concat(
        ...argv);
    const _env  = (opts) => {
        return Object.assign({ 'NODE_ENV': 'test' }, opts);
    };
    describe('parse', function(){
        it('should parse regex', function(){
            const re = parse('{"hello":"/stuff/"}');
            expect(re.hello).to.be.instanceof(RegExp);
            expect(re.hello+'').to.eql('/stuff/');
        });
        it('should parse regex gim', function(){
            const re = parse('{"hello":"/stuff/gim"}');
            expect(re.hello).to.be.instanceof(RegExp);
            expect(re.hello+'').to.eql('/stuff/gim');
        });
        it('should parse regex g', function(){
            const re = parse('{"hello":"/stuff/g"}');
            expect(re.hello).to.be.instanceof(RegExp);
            expect(re.hello+'').to.eql('/stuff/g');
        });
    });

    describe('env aliases', function () {
        it('should mergeAlias', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'true', '--something-else');
            const env      = _env({ 'WHATEVER': 'false' });
            const opts     = mergeAlias({ stuff: 1 }, ['whatever'], aliasObj,
                { env, argv });
            expect(opts).to.eql({ stuff: 1, whatever: false });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should mergeAlias with camel', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'true', '--something-else');
            const env      = _env({ 'WHATEVER_WORLD': '1' });
            const opts     = mergeAlias({ stuff: 1 },
                ['whatever', 'whateverWorld'], aliasObj,
                { env, argv });
            expect(opts).to.eql({ stuff: 1, whatever: true, whateverWorld: 1 });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should mergeAlias with array', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'true', '--something-else');
            const env      = _env(
                { 'WHATEVER': 'false', 'SOMETHING': "[1,2,3]" });
            const opts     = mergeAlias({ stuff: 1 }, ['whatever', 'something'],
                aliasObj,
                { env, argv });
            expect(opts).to.eql(
                { stuff: 1, whatever: false, something: [1, 2, 3] });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should mergeAlias with empty as true', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'true', '--something-else');
            const env      = _env(
                { 'WHATEVER': 'false', 'SOMETHING': void 0 });
            const opts     = mergeAlias({ stuff: 1 }, ['whatever', 'something'],
                aliasObj,
                { env, argv });
            expect(opts).to.eql(
                { stuff: 1, whatever: false, something: true });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });

    });
    describe('argv aliases', function () {
        it('should mergeAlias', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'false', '--something-else');
            const opts     = mergeAlias({ stuff: 1 }, ['whatever'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1, whatever: false });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should not mergeAlias', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', 'false', '--something-else');
            const opts     = mergeAlias({ stuff: 1 }, [], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1 });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--whatever', 'false', '--something-else']);

        });
        it('should mergeAlias with =', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--something-else', '--whatever=false');
            const opts     = mergeAlias({ stuff: 1 }, ['whatever'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1, whatever: false });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should mergeAlias with no = at end', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--something-else', '--whatever');
            const opts     = mergeAlias({ stuff: 1 }, ['whatever'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1, whatever: true });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should mergeAlias with no = at end whatever', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--whatever', '--something-else');
            const opts     = mergeAlias({ stuff: 1 }, ['whatever'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1, whatever: true });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should camelCase with no = at end', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--something-else', '--whatever-stuff');
            const opts     = mergeAlias({ stuff: 1 }, ['whateverStuff'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1, whateverStuff: true });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else']);

        });
        it('should allow single variable alias', function () {
            const aliasObj = { more: 1 };
            const argv     = _argv('--something-else', 'more', '-p');
            const opts     = mergeAlias({ stuff: 1 }, ['p'], aliasObj,
                { env: {}, argv });
            expect(opts).to.eql({ stuff: 1,  p:true });
            expect(argv).to.eql(
                ['ignore-first', 'ignore-second', '--something-else', 'more']);

        });
    });
});

import { makeOptions, settings } from '../src/muck';
import { expect } from 'chai';

const { ...osettings } = settings;

describe('@mrbuilder/tool', function () {
    describe('makeOptions', function () {

        const mocks = {
            error: [],
            exit : [],
            warn : [],
            log  : [],
            trace: [],
        };
        /**
         *    exit : process.exit,
         error: console.error,
         warn : console.warn,
         log  : console.log,
         trace: console.trace,
         */
        beforeEach(() => {
            Object.keys(mocks).forEach(key =>
                settings[key] = mocks[key].push.bind(mocks[key]));
        });
        afterEach(() => {
            Object.keys(mocks).forEach(key => {
                mocks[key].length = 0;
                settings[key]     = osettings[key];
            })
        });
        const runOpts = (expected, ...args) => {
            it(`should makeOptions "${args.join(' ')}"`, function () {
                expected(makeOptions('hello', args));
            });
        };

        runOpts(function (r) {
            expect(mocks.exit[0]).to.eql(1);
            expect(mocks.warn[0].trim()).to.eql(
                'hello   [-sdgihfe] <files>\n      -b\t--backup\t<extension>\tuse a different extension\n      -p\t--prompt\tkey=question\tprompt for value before changing\n      -c\t--confirm\t\tconfirm before dangerous operations\n      -m\t--move\t\tfrom=to\tMove property from=to\n      -s\t--set\t\tkey=value sets key to value\n      -d\t--delete\tkey\tdeletes values (comma)\n      -g\t--get\t\tvalue\tgets the value\n      -i\t--ignore\tpackages to ignore\n      -h\t--help\t\tthis helpful message\n      -f\t--file\t\tpackage.json default\n      -k\t--skip\t\tSkip the question if it has value\n      -n\t--no-lerna\tJust use the file don\'t iterate over lerna projects\n      -C\t--create-file\tCreate the file if it does not exist\n      -P\t--preview\tPreview files if there are changes, before writing.\n      -u\t--unless\tDo the action only if it has a value \n      -S\t--scope packages,\t Only apply to these packages (glob).\n      --no-extension\tuse in place');

        }, '--help');

        runOpts(({ commands }) => {
            expect(commands[0][1][0]).to.eql('whatever');
        }, '--prompt', 'whatever');

        runOpts(({ commands }) => {
            expect(commands[0][1]).to.eql(['yuck', 'yum']);
        }, '--set', 'yuck=yum');
        runOpts(({ commands }) => {
            expect(commands[0][1]).to.eql(['yuck', 'yum']);
        }, '--move', 'yuck=yum');
        runOpts(({ commands }) => {
            expect(commands[0][1]).to.eql(['yuck']);
        }, '--delete', 'yuck');
        runOpts(({ commands }) => {
            expect(commands[0][1]).to.eql(['yuck', { value: 1 }]);
        }, '--set', 'yuck={"value":1}');
    });
});

import OptionsManager from '../src/OptionsManager';
import { join } from 'path';
import { expect } from 'chai';
import { stringify } from 'mrbuilder-utils';
import { existsSync, readdirSync, statSync, symlinkSync, unlinkSync } from 'fs';

const isDirectory = sourceDir => {
    try {
        const s = statSync(sourceDir);
        return s.isDirectory();
    } catch (e) {
        return false;
    }
};


const odir = __dirname;
describe('mrbuilder-optionsmanager', function () {
    const argv   = (...argv) => ['fake-interpreter', 'fake-script'].concat(
        ...argv);
    const afters = [];
    const re     = (obj, assert) => {
        expect(obj).to.be.instanceof(RegExp);
        expect(obj + '').to.eql(assert);
    };

    const cwd = (name) => {
        const ret           = join(__dirname, 'fixtures', name);
        const sourceNodeDir = join(ret, 'node_modules');
        if (isDirectory(sourceNodeDir)) {
            readdirSync(sourceNodeDir).forEach(dir => {
                const sourceDir = join(sourceNodeDir, dir);
                if (isDirectory(sourceDir)) {
                    const dest = join(__dirname, '..', 'node_modules', dir);
                    if (existsSync(dest)) {
                        unlinkSync(dest);
                    }
                    afters.push(() => {
                        existsSync(dest) && unlinkSync(dest)
                    });
                    symlinkSync(sourceDir, dest);
                }
            });
        }
        process.chdir(ret);
        return () => ret;
    };

    function newOptionManagerTest(name, config, assert, fn = it) {
        if (name == null) {
            throw 'name can not be null';
        }
        if (!assert) {
            assert = config;
            config = null;
        }
        fn(`should configure "${name}"${config ? ` and env ${stringify(
            config)}` : ''}`, function () {
            assert(new OptionsManager(Object.assign({
                prefix: 'tester',
                cwd   : cwd(name),
            }, config)), config);
        });

        newOptionManagerTest.only =
            (_name, _config, _assert) => newOptionManagerTest(_name, _config,
                _assert, it.only);

        newOptionManagerTest.skip =
            (_name, _config, _assert) => newOptionManagerTest(_name, _config,
                _assert, it.skip);

        return newOptionManagerTest;
    };
    afterEach(() => {
        afters.forEach(c => c());
        process.chdir(odir)
    });

    newOptionManagerTest('boot', om => expect(om).to.exist);

    newOptionManagerTest('with-plugin',
        om => expect(om.enabled('whatever')).to.be.true);

    newOptionManagerTest('with-plugin-and-config', om => {
        expect(om.enabled('whatever')).to.be.true;
        expect(om.config('whatever.someValue')).to.be.true;
    });

    newOptionManagerTest('with-plugin-plugin', om => {

        expect(om.enabled('plugin-plugin')).to.be.true;
        expect(require(om.plugins.get('plugin-plugin').plugin)('a')).to
                                                                    .eql(['a']);
    });
    newOptionManagerTest('with-plugin-plugin-opts', om => {
        expect(om.enabled('plugin-plugin-opts')).to.be.true;
        expect(om.config('plugin-plugin-opts.something')).to.be.true;

    });
    newOptionManagerTest('with-rc', om => {
        expect(om.enabled('metest')).to.be.true;
    });

    newOptionManagerTest('with-env', {
        env: {
            TESTER_PLUGINS: 'metest',
            METEST_STUFF  : "1"
        }
    }, (om) => {
        expect(om.enabled('metest')).to.be.true;
        expect(om.config('metest.stuff')).to.eq(1);
    });


    newOptionManagerTest('with-env', {
        env : {
            TESTER_PLUGINS: 'metest',

        },
        argv: argv(
            '--metest-stuff=3',
            '--metest-stuff-or="stuff"'
        )
    }, om => {
        expect(om.enabled('metest')).to.be.true;
        expect(om.config('metest.stuff')).to.eq(3);
        expect(om.config('metest.stuffOr')).to.eq('stuff');

    });

    newOptionManagerTest('with-disabled', {
        argv: argv('--metest-stuff=3', '--metest-stuff-or="stuff"')
    }, om => {
        expect(om.enabled('metest')).to.be.false;
        expect(om.enabled('enabled')).to.be.true;
    });

    newOptionManagerTest('with-presets', {
        argv: argv(
            '--p1-stuff=3',
            '--p2-stuff-or="stuff"',
            '--preset-pp="abc"'
        )
    }, om => {
        expect(om.enabled('p1')).to.be.true;
        expect(om.enabled('p2')).to.be.true;

    });

    newOptionManagerTest('with-presets-and-config', om => {
        expect(om.enabled('p1')).to.be.eql(true);
        expect(om.enabled('p2')).to.be.eql(true);
        expect(om.config('p1.ppe')).to.be.eql(2);
        expect(om.config('p2.ppe')).to.be.eql(2);
    });
    newOptionManagerTest('with-self-plugin', om => {
        expect(om.enabled('with-self-plugin')).to.be.eql(true);
        const plugin = om.plugins.get('with-self-plugin').plugin;
        const ret    = require(plugin);
        expect(ret()).to.be.eql('Hi, whatever');
    });
    newOptionManagerTest('with-regex', {
        argv: argv("--regex-argv=/argv/g", "--realias=/realias/",
            "--regex-split", "/split/"),
        env : { "REGEX_ENV": "/env/i" }
    }, (om, config) => {
        expect(om.enabled("regex")).to.be.true;
        re(om.config('regex.argv'), "/argv/g");
        re(om.config('regex.env'), "/env/i");
        re(om.config('regex.config'), "/config/");
        re(om.config('regex.split'), "/split/");
        re(om.config('regex.realias'), "/realias/");

        expect(config.argv).to.eql(argv());

    });
    newOptionManagerTest('with-alias-override', {
        argv:argv('--alias-2.stuff=whatever')
    }, function (om) {
        expect(om.config('alias-1.stuff')).to.eql('Override');
        expect(om.config('alias-2.stuff')).to.eql('whatever');
    });

    newOptionManagerTest("with-alias", {
        argv: argv('--stuff', 'whatever')
    }, function (om) {

        expect(om.enabled("alias-1")).to.be.true;
        expect(om.enabled("alias-2")).to.be.true;
        expect(om.config('alias-1.stuff')).to.eql('whatever');
        expect(om.config('alias-2.stuff')).to.eql('whatever');

        expect(om.help()).to.eql(`alias-1 - [enabled]
	--stuff	Here is stuff
	--astuff	Here is alias-1-stuff
alias-2 - [enabled]
	--stuff	Here is stuff
	--other	Other description
	--astuff	Here is alias-2-stuff\n`);

    });
    it('should log from option', function () {
        const calls   = [];
        const capture = (...args) => calls.push(args);

        const om = new OptionsManager({
            prefix: 'tester',
            cwd   : cwd('with-presets-and-config'),
            env   : { TESTER_DEBUG: 12 },
            info  : capture,
            warn  : capture
        });
        om.plugins.get('p1').info('test');
        om.plugins.get('p1').warn('test');
        expect(calls.pop().join(' ')).to.eql('WARN [tester:p1] test');
        expect(calls.pop().join(' ')).to.eql('INFO [tester:p1] test');
    });
    it('should only load with-node-env test', function () {
        const calls   = [];
        const capture = (...args) => calls.push(args);

        const om = new OptionsManager({
            prefix: 'tester',
            cwd   : cwd('with-node-env'),
            env   : { NODE_ENV: "test" },
            info  : capture,
            warn  : capture
        });
        expect(om.enabled("webtest")).to.be.true;
    });
    it('should only load with-mrb-env test using TESTER_ENV', function () {
        const calls   = [];
        const capture = (...args) => calls.push(args);

        const om = new OptionsManager({
            prefix: 'tester',
            cwd   : cwd('with-mrb-env'),
            env   : { TESTER_ENV: "whatever" },
            info  : capture,
            warn  : capture
        });
        expect(om.enabled("webtest")).to.be.true;
    })
});

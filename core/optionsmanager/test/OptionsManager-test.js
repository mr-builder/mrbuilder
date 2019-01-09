const OptionsManager = require('../src/OptionsManager');
const { join }       = require('path');
const { expect }     = require('chai');
const { stringify }  = require('@mrbuilder/utils');
const {
          existsSync,
          readdirSync,
          statSync,
          symlinkSync,
          unlinkSync
      }              = require('fs');

const isDirectory = sourceDir => {
    try {
        const s = statSync(sourceDir);
        return s.isDirectory();
    } catch (e) {
        return false;
    }
};

const odir = __dirname;
describe('@mrbuilder/optionsmanager', function () {

    process.env.TESTER_NO_AUTOINSTALL = 1;

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

            const env = Object.assign({
                TESTER_NO_AUTOINSTALL: 1,
            }, config && config.env);


            assert(new OptionsManager(Object.assign({
                prefix  : 'tester',
                cwd     : cwd(name.split(' ')[0]),
                env,
                _require: require,
                handleNotFound(e, pkg) {
                    console.log(e, pkg);
                    throw e;
                }
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

    newOptionManagerTest("with-cli", {
        argv: argv(
            [`--with-cli-alias-1-other={\"index\":{\"title\":\"Index\"},\"other\":{\"title\":\"Other\"}}`])
    }, om => {
        expect(om.config('with-cli-alias-1.other')).to.eql(
            { "index": { "title": "Index" }, "other": { "title": "Other" } });
    });
    newOptionManagerTest('boot', om => expect(om).to.exist);

    newOptionManagerTest('with-presets-env', {
        env: {
            TESTER_ENV: 'merge-with-default'
        }
    }, om => {
        expect(om.enabled('preset-env-plugin-1')).to.eql(true);
        expect(om.enabled('preset-env-plugin-2')).to.eql(true);
    });
    newOptionManagerTest('with-presets-env other env', {
        env: {
            TESTER_ENV: 'other'
        }
    }, om => {
        expect(om.enabled('preset-env-plugin-1')).to.eql(true);
        expect(om.enabled('preset-env-plugin-2')).to.eql(false);
    });

    newOptionManagerTest('with-named-plugin', om => {
        expect(om.enabled('named-plugin')).to.eql(true);
        expect(om.require(om.plugins.get('named-plugin').plugin)()).to.eql(
            'named plugin');

    });
    newOptionManagerTest("with-multi-env test:other", {
        env: {
            TESTER_ENV           : 'test:other',
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.true;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });

    newOptionManagerTest("with-multi-env other", {
        env: {
            TESTER_ENV           : 'other',
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.false;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });
    newOptionManagerTest("with-multi-env other without test", {
        env: {
            TESTER_ENV           : 'other:nosuch',
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.false;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });
    newOptionManagerTest('with-merged-plugins', {
        env: {
            TESTER_ENV           : 'test',
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, om => {
        expect(om.enabled('merge-0')).to.be.false;
        expect(om.enabled('merge-1')).to.be.true;
        expect(om.enabled('merge-2')).to.be.true;
        expect(om.enabled('merge-3')).to.be.true;
        expect(om.config('merge-2.test')).to.be.undefined;
        expect(om.config('merge-1.test')).to.eql(1);

    });
    newOptionManagerTest('with-alias-camel', {
        argv: argv('--camel-arg', 'yes'),
        env : {
            CAMEL_ENV           : 'uh-huh',
            CAMEL_NO_AUTOINSTALL: 1,
        }
    }, om => {
        expect(om.config('camel-alias-1.camelArg')).to.eql('yes');
        expect(om.config('camel-alias-1.camelEnv')).to.eql('uh-huh');

    });

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
            TESTER_PLUGINS       : 'metest',
            METEST_STUFF         : "1",
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, (om) => {
        expect(om.enabled('metest')).to.be.true;
        expect(om.config('metest.stuff')).to.eq(1);
    });


    newOptionManagerTest('with-env', {
        env : {
            TESTER_PLUGINS       : 'metest',
            TESTER_NO_AUTOINSTALL: 1,

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
        argv: argv(
            "--regex-argv=/argv/g",
            "--realias=/realias/",
            "--regex-split", "/split/"),
        env : { "REGEX_ENV": "/env/i", REGEX_NO_AUTOINSTALL: 1, }
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
        argv: argv('--alias-2.stuff=whatever')
    }, function (om) {
        expect(om.config('alias-1.stuff')).to.eql('Override');
        expect(om.config('alias-2.stuff')).to.eql('whatever');
    });
    newOptionManagerTest('with-merge-alias-override', {
        argv: argv('--alias-2.stuff=whatever'),
        env : {
            ALIAS_1_MORE         : "stuff",
            ALIAS_2_YUP          : "true",
            TESTER_NO_AUTOINSTALL: 1,
        }
    }, function (om) {
        expect(om.config('alias-1.stuff')).to.eql('Override');
        expect(om.config('alias-2.stuff')).to.eql('whatever');
        expect(om.config('alias-1.more')).to.eql('stuff');
        expect(om.config('alias-2.yup')).to.eql(true);
    });

    newOptionManagerTest("with-plugin-array", function (om) {

        expect(om.enabled('wpa-plugin'));
        expect(om.enabled('wpa-plugin-deb'));
        const o = om.plugins.get('wpa-plugin');
        console.log(om.plugins);
    });

    newOptionManagerTest("with-alias", {
        argv: argv('--stuff', 'whatever')
    }, function (om) {

        expect(om.enabled("with-alias-1")).to.be.true;
        expect(om.enabled("with-alias-2")).to.be.true;
        expect(om.config('with-alias-1.stuff')).to.eql('whatever');
        expect(om.config('with-alias-2.stuff')).to.eql('whatever');
        expect(om.help()).to.eql(`with-alias-1 - [enabled]
	--stuff	Here is stuff
	--astuff	Here is alias-1-stuff
with-alias-2 - [enabled]
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
            env   : { TESTER_DEBUG: 12, TESTER_NO_AUTOINSTALL: 1, },
            info  : capture,
            warn  : capture
        });
        om.plugins.get('p1').info('test');
        om.plugins.get('p1').warn('test');
        expect(calls.pop().join(' ')).to.eql('WARN [tester:p1] test');
        expect(calls.pop().join(' ')).to.eql('INFO [tester:p1] test');
    });

    newOptionManagerTest("with-disabled-plugin", {
        "argv":argv("--plugin-disabled.stuff=1")
    }, om=>{
        expect(om.enabled('plugin-enables')).to.be.true;
        expect(om.enabled('plugin-disabled')).to.be.false;

    });
});

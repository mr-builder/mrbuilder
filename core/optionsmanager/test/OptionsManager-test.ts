import {OptionsManager} from '../src';
import {join, parse} from 'path';
import {expect} from 'chai';
import {stringify} from "@mrbuilder/utils";
import 'mocha';

import {
    existsSync,
    readdirSync,
    statSync,
    symlinkSync,
    unlinkSync,
    mkdirSync,
} from 'fs';
import {CwdFn, OptionsManagerConfig} from "../src/types";

const isDirectory = (sourceDir: string): boolean => {
    try {
        const s = statSync(sourceDir);
        return s.isDirectory();
    } catch (e) {
        return false;
    }
};
const mkdirs = (dirs: string): string => {
    const parts = dirs.split('/');
    for (let i = 0, l = parts.length; i < l; i++) {
        if (parts[i]) {
            const dirPath = join(...parts.slice(0, i + 1));
            if (!isDirectory(dirPath)) {
                mkdirSync(dirPath);
            }
        }
    }
    return dirs;
};
const symlinkSyncDir = (sourceDir: string, destDir: string): void => {
    const parts = parse(destDir);
    if (!isDirectory(parts.dir)) {
        mkdirs(parts.dir);
    }
    symlinkSync(sourceDir, destDir);
};

const odir = __dirname;


type ValidateFn = () => void;

type Config = Partial<{
    cwd: CwdFn,
    env: { [key: string]: any },
    argv: string[],
} & OptionsManagerConfig>;
type AssertOptionManagerFn = (o: OptionsManager, obj?: { [key: string]: any }) => void;
type TestFn = (name: string, config: Config | AssertOptionManagerFn, assert?: AssertOptionManagerFn, fn?: Mocha.ExclusiveTestFunction) => void;

describe('@mrbuilder/optionsmanager', function () {

    process.env.TESTER_NO_AUTOINSTALL = 'true';
    const argv = (...argv: string[] | string[][]) => ['fake-interpreter', 'fake-script'].concat(...argv);
    const afters: ValidateFn[] = [];
    const re = (obj: any, assert: any) => {
        expect(obj).to.be.instanceof(RegExp);
        expect(obj + '').to.eql(assert);
    };

    const cwd = (name: string): CwdFn => {
        const ret = join(__dirname, 'fixtures', name);
        const sourceNodeDir = join(ret, 'node_modules');
        if (isDirectory(sourceNodeDir)) {
            readdirSync(sourceNodeDir).forEach(dir => {
                const sourceDir = join(sourceNodeDir, dir);
                try {
                    if (isDirectory(sourceDir)) {
                        const dest = join(__dirname, '..', 'node_modules', dir);
                        if (existsSync(dest)) {

                            unlinkSync(dest);
                        }
                        afters.push(() => {
                            existsSync(dest) && unlinkSync(dest)
                        });
                        symlinkSyncDir(sourceDir, dest);
                    }
                } catch (e) {
                    console.warn(`error ${sourceDir}`, e);
                }
            });
        }
        process.chdir(ret);
        return () => ret;
    };

    const newOptionManagerTest: TestFn & {
        only: TestFn,
        skip: TestFn,
    } = Object.assign((name: string, config: Config | AssertOptionManagerFn, assert?: AssertOptionManagerFn, fn: Mocha.TestFunction = it): void => {
        if (name == null) {
            throw 'name can not be null';
        }
        if (!assert && typeof config === 'function') {
            assert = config;
            config = {};
        }
        fn(`should configure "${name}"${config ? ` and env ${stringify(config)}` : ''}`, function () {

            assert(new OptionsManager({

                prefix: 'tester',
                cwd: cwd(name.split(' ')[0]),
                _require: require,
                handleNotFound(e, pkg) {
                    console.log(e, pkg);
                    throw e;
                },
                ...config,
                env: {
                    TESTER_NO_AUTOINSTALL: '1',
                    //@ts-ignore
                    ...config?.env,
                }
            }), config);
        });
    }, {
        only: (_name: string, _config?: Config | AssertOptionManagerFn, _assert?: AssertOptionManagerFn) => newOptionManagerTest(_name, _config, _assert, it.only),
        skip: (_name: string, _config?: Config | AssertOptionManagerFn, _assert?: AssertOptionManagerFn) => newOptionManagerTest(_name, _config, _assert, it.skip),
    });

    afterEach(() => {
        afters.forEach(c => c());
        process.chdir(odir)
    });

    newOptionManagerTest("with-default-options", {}, om => {
        expect(om.config('with-option-1.opt1')).to.eql(1);
        expect(om.config('with-option-2.opt2')).to.eql(3);
        expect(om.config('with-option-2.merged')).to.eql(1);
    });
    newOptionManagerTest("with-default-env-options", {
        'env': {TESTER_ENV: 'env1'}
    }, om => {
        expect(om.config('with-option-env-1.opt1')).to.eql('env1');
        expect(om.config('with-option-env-2.opt2')).to.eql(3);
    });
    newOptionManagerTest("with-default-env-options", {
        'env': {TESTER_ENV: 'env1:env2'}
    }, om => {
        expect(om.config('with-option-env-1.opt1')).to.eql('env1');
        expect(om.config('with-option-env-2.opt2')).to.eql(3);
        expect(om.config('with-option-env-2.expect')).to.eql('env2');
    });

    newOptionManagerTest("with-cli", {
        argv: argv(`--with-cli-alias-1.other={\"index\":{\"title\":\"Index\"},\"other\":{\"title\":\"Other\"}}`)
    }, om => {
        expect(om.config('with-cli-alias-1.other')).to.eql(
            {"index": {"title": "Index"}, "other": {"title": "Other"}});
    });

    newOptionManagerTest("with-cli", {
        argv: argv(`--with-cli-alias-1=false`)
    }, om => {
        expect(om.enabled('with-cli-alias-1')).to.eql(false);
    });

    newOptionManagerTest("with-cli", {
        env: {
            "WITH_CLI_ALIAS_1": JSON.stringify({"stuff": 1})
        },
        argv: argv(`--with-cli-alias-1=false`)
    }, om => {
        expect(om.enabled('with-cli-alias-1')).to.eql(false);
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
        const val = om.plugins.get('named-plugin');
        if (typeof val === 'boolean' || typeof val === 'function') {
            expect(val).to.not.be.false;
            throw Error(`named-plugin not found`);
        }
        expect(om.require(val.plugin + '')()).to.eql('named plugin');

    });
    newOptionManagerTest("with-multi-env test:other", {
        env: {
            TESTER_ENV: 'test:other',
            TESTER_NO_AUTOINSTALL: 'true',
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.true;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });

    newOptionManagerTest("with-multi-env other", {
        env: {
            TESTER_ENV: 'other',
            TESTER_NO_AUTOINSTALL: 'true',
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.false;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });
    newOptionManagerTest("with-multi-env other without test", {
        env: {
            TESTER_ENV: 'other:nosuch',
        }
    }, om => {
        expect(om.enabled('with-multi-env-p1')).to.be.true;
        expect(om.enabled('with-multi-env-p2')).to.be.false;
        expect(om.enabled('with-multi-env-p3')).to.be.true;
    });
    newOptionManagerTest('with-merged-plugins', {
        env: {
            TESTER_ENV: 'test',
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
        env: {
            CAMEL_ENV: 'uh-huh',
            CAMEL_NO_AUTOINSTALL: 'true',
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
        const val = om.plugins.get('plugin-plugin');
        if (typeof val === 'object' || typeof val == 'function') {
            expect(require(val.plugin + '')('a')).to.eql(['a']);
        } else {
            expect.fail(false, true, 'not correct type');
        }
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
            METEST: JSON.stringify({"stuff": 1})
        }
    }, (om) => {
        expect(om.enabled('metest')).to.be.true;
        expect(om.config('metest.stuff')).to.eq(1);
    });


    newOptionManagerTest('with-env', {
        env: {
            TESTER_PLUGINS: 'metest'

        },
        argv: argv(
            '--metest.stuff=3',
            '--metest.stuff-or="stuff"'
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
        const v = om.plugins.get('with-self-plugin');
        if (typeof v === 'function' || typeof v === 'object') {
            const plugin = v.plugin;
            const ret = require(plugin + '');
            expect(ret()).to.be.eql('Hi, whatever');
        } else {
            expect.fail(v, {}, 'plugin should have been an object');
        }
    });
    newOptionManagerTest('with-regex', {
        argv: argv(
            "--regex.argv=/argv/g",
            "--realias=/realias/",
            "--regex.split", "/split/"),
        env: {"REGEX": JSON.stringify({"env": "/env/i"})}
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
        env: {
            ALIAS_1: JSON.stringify({more: "stuff"}),
            ALIAS_2: JSON.stringify({yup: true}),
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
        const calls: string[][] = [];
        const capture = (...args: string[]) => calls.push(args);

        const om = new OptionsManager({
            prefix: 'tester',
            cwd: cwd('with-presets-and-config'),
            env: {TESTER_DEBUG: 12, TESTER_NO_AUTOINSTALL: 1,},
            log: capture,
        });

        om.logger('p1').info('test');
        om.logger('p1').warn('test');
        expect(calls.pop().join(' ')).to.eql('warn p1 test');
        expect(calls.pop().join(' ')).to.eql('info p1 test');
    });

    newOptionManagerTest("with-disabled-plugin", {
        "argv": argv("--plugin-disabled.stuff=1")
    }, om => {
        expect(om.enabled('plugin-enables')).to.be.true;
        expect(om.enabled('plugin-disabled')).to.be.false;

    });
});

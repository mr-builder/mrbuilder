import {get, objToConf, parseIfBool, parseJSON,} from '@mrbuilder/utils';
import cp from 'child_process';
import {basename, join, resolve} from 'path';
import handleNotFoundTryInstall from './handleNotFoundTryInstall';
import _help from './help';
import {
    AliasObj,
    EnvFn,
    ForEachFn,
    Logger,
    LoggerFn,
    NameOrPluginNameConfig,
    OptionsConfig,
    OptionsManagerConfig,
    OptionsManagerType,
    OptionType,
    OptionValueObj,
    Package,
    PluginNameConfig,
    PluginValue,
    RequireFn,
    InitFn
} from "./types";
import {envify, mergeAlias, mergeArgs, mergeEnv, mergeOptions, mergePlugins, resolveEnv, select, split} from './util';

const handleNotFoundFail = function (e: Error, pkg: string) {
    this.warn('could not require "%s/package.json" from "%s"',
        pkg,
        process.cwd()
    );
    throw e;
};

type OptionsPackage = Partial<{
    presets: PluginNameConfig[],
    plugins: PluginNameConfig[],
    options: OptionValueObj[],
    ignoreRc: boolean,
    plugin: string
    alias: AliasObj
}>;

type LogLevel = 'WARN' | 'INFO' | 'DEBUG';

const nameConfig = (v: string | PluginNameConfig): PluginNameConfig => typeof v === 'string' ? [v] : v;

type ResolvedOption = false | OptionType;

export default class OptionsManager implements OptionsManagerType {

    readonly plugins = new Map<string, ResolvedOption>();
    readonly require: RequireFn;
    readonly env: EnvFn;
    public topPackage: Package;
    help: () => void;
    cwd: (...paths: string[]) => string;
    warn: LoggerFn;
    info: LoggerFn;
    debug: LoggerFn;
    log: (level: LogLevel, pluginName: string, ...args: any[]) => void;

    constructor({
                    prefix,
                    envPrefix,
                    confPrefix,
                    rcFile,
                    env = process.env,
                    argv = process.argv,
                    cwd = process.cwd,
                    info = console.info || console.warn,
                    debug = console.info || console.warn,
                    warn = console.warn,
                    _require = require,
                    //Object of collected aliases, may be modified
                    aliasObj = {},
                    topPackage,
                    handleNotFound = handleNotFoundTryInstall,
                    plugins = [],
                    presets = [],
                }: OptionsManagerConfig = {
        env: process.env,
        argv: process.argv,
        cwd: process.cwd,
        info: console.info || console.warn,
        debug: console.info || console.warn,
        warn: console.warn,
        _require: require,
        //Object of collected aliases, may be modified
        aliasObj: {},
        handleNotFound: handleNotFoundTryInstall,
        plugins: [],
        presets: [],
    }) {
        const seenPresets = new Set();
        this.help = _help(this);
        if (!prefix) {
            prefix = basename(argv[1]).split('-').shift()
        }
        prefix = envify(prefix);
        envPrefix = envPrefix || envify(prefix);
        confPrefix = confPrefix || prefix.toLowerCase();
        rcFile = `.${confPrefix}rc`;

        this.require = _require;

        this.env = (key: string, def: any): any => {
            const ret = env[`${envPrefix}_${key.toUpperCase()}`];
            if (ret == null) {
                return def;
            }
            return parseIfBool(ret);
        };

        if (!handleNotFound || this.env(`NO_AUTOINSTALL`)) {
            handleNotFound = handleNotFoundFail.bind(this);
        } else {
            handleNotFound = handleNotFoundTryInstall.bind(this);
        }

        this.cwd = (...paths) => resolve(this.env('MODULE_DIR', cwd()), ...paths);
        this.topPackage = topPackage || _require(this.cwd('package.json'));

        this.log = (level: LogLevel, plugin: string, ...args: any[]) => {
            if (this.env(`QUIET`) && level !== 'WARN') {
                return;
            }
            const message = `${level} [${prefix.toLowerCase()}${plugin ? `:${plugin}` : ''}]`;
            switch (level) {
                case 'DEBUG':
                    if (this.env(`DEBUG`)) {
                        return debug(message, ...args);
                    }
                    break;
                case 'INFO':
                    return info(message, ...args);
                case 'WARN':
                    return warn(message, ...args);
            }
        };

        this.warn = this.log.bind(this, 'WARN', null);
        this.debug = this.log.bind(this, 'DEBUG', null);
        this.info = this.log.bind(this, 'INFO', null);

        if (_require === require) {
            this.warn('require is not set, using default require');
        }

        const ENV: string = this.env('ENV', env.NODE_ENV);

        this.info('ENV is', ENV || 'not set');
        this.debug('topPackage is', this.topPackage.name);

        const resolveFromPkgDir = (pkg: string, file: string, ...relto: string[]) => {
            if (!pkg || this.topPackage.name === pkg) {
                if (file === 'package.json') {
                    pkg = this.cwd(file);
                }
                return this.cwd(file, ...relto);
            }
            if (file === 'package.json') {
                return resolve(join(pkg, file))
            }
            return resolve(_require.resolve(join(pkg, 'package.json')), '..', file, ...relto);
        };
        const resolvePkgJson = (packageName: string, retry = true): Package => {
            if (packageName === this.topPackage.name) {
                return this.topPackage;
            }
            if (resolvePkgJson.cache.has(packageName)) {
                return resolvePkgJson.cache.get(packageName);
            }

            const pkgPath = join(packageName, 'package.json');

            try {
                if (!this.env(`NO_AUTOINSTALL`)) {
                    if (retry) {
                        //so node has a stat cache that is pretty much
                        // impossible to clear so we are going to try this
                        // which isn't quite right, as the context could
                        // be wrong.
                        // But to be extra sure, we'll try it again
                        // without this check and see if it works.
                        // This should blow up first, if there a package
                        // does not exist.   Second time it doesn't try
                        // this as the package _should_ be there.  if it
                        // is great we'll be fine. If it doesn't an error
                        // is thrown.
                        cp.execFileSync(process.argv[0],
                            ['-e', `require.resolve('${pkgPath}')`],
                            {stdio: 'ignore', cwd: cwd()});
                    }
                }

                const ret = parseJSON(_require.resolve(pkgPath)) as Package;
                resolvePkgJson.cache.set(packageName, ret);
                return ret;
            } catch (e) {
                //This should throw if it can't find it
                //otherwise we try resolving again.
                if (retry) {
                    handleNotFound.call(this, e, packageName);
                    return resolvePkgJson(packageName);
                }

                throw e;

            }
        };

        resolvePkgJson.cache = new Map<string, Package>();

        const resolveConfig = (id: string | Package): OptionsPackage => {
            const pkg: Package = typeof id === 'string' ? resolvePkgJson(id) : id;

            const pluginConfig: OptionsConfig = pkg[confPrefix] ? objToConf(pkg[confPrefix]) : parseJSON(resolveFromPkgDir(pkg.name, rcFile)) || {};

            const envOverride: OptionsConfig = pluginConfig.env && pluginConfig.env[ENV] ? objToConf(pluginConfig.env[ENV]) as OptionsConfig : null;

            const config = {
                presets: mergePlugins(...resolveEnv(ENV, 'presets', pluginConfig)),
                plugins: mergePlugins(...resolveEnv(ENV, 'plugins', pluginConfig)),
                options: resolveEnv(ENV, 'options', pluginConfig),
                ignoreRc: select(envOverride?.ignoreRc, pluginConfig.ignoreRc),
                plugin: select(envOverride?.plugin, pluginConfig.plugin),
                alias: pluginConfig.alias

            };
            return config;
        };


        const newOption = (name: string, plugin: string, config: {}, parent?: Package, alias?: AliasObj): Option | false => {
            if (config === false) {
                return false;
            }
            return new Option(name, plugin, config, this, parent, alias);
        };

        const processPlugin = (includedFrom: string, plugin: NameOrPluginNameConfig, override: {}, parent: Package): boolean | string => {
            let [pluginName, pluginOpt] = typeof plugin === 'string' ? [plugin] : plugin;
            if (typeof pluginName !== 'string') {
                throw new Error(`Plugin name needs to be a string, received ${typeof pluginName} please check your '${prefix}' config from '${includedFrom}'`);
            }

            if (this.plugins.has(pluginName)) {
                return false;
            }
            //We don't handle alias options here because we may have to install the package to handle the alias.
            // but if the resolvedOptions where false by now the alias would not matter.
            const options = [mergeArgs(pluginName, argv), mergeEnv(pluginName, env), override, pluginOpt];
            if (options.includes(false)) {
                //nothing more to do.
                this.plugins.set(pluginName, false);
                return false;
            }
            let pluginSrc = pluginName;
            let ret: string | false = pluginName;
            let alias: AliasObj | undefined;
            //I wish I knew what this startsWith is for -- if someone finds out can they add a comment or something.
            if (pluginName.startsWith('.')) {
                if (includedFrom === this.topPackage.name) {
                    pluginSrc = this.cwd(pluginName);
                } else {
                    pluginSrc = join(includedFrom, pluginName);
                }
                ret = false;
            } else {
                //warning this could trigger a plugin install.
                const pConfig = resolveConfig(pluginName);
                if (pConfig) {
                    if (pConfig.plugin) {
                        let [pluginPath, prPluginOpts] = nameConfig(pConfig.plugin);
                        //this bugger - i think its probably not right but...  That a plugin can define its own defaults.
                        // but I guess so...
                        if (prPluginOpts != false) {
                            options.push(prPluginOpts);
                        }
                        if (pluginPath) {
                            if (pluginName === this.topPackage.name) {
                                pluginSrc = this.cwd(pluginPath);
                            } else {
                                pluginSrc = join(pluginName, pluginPath);
                            }
                        }
                    }
                    options.push(...pConfig.options);

                    alias = pConfig.alias;
                }
            }


            //At this point nothing can disable the plugin.   If an alias was false, well it was probably a property
            // you can't set a module false inside of itself.  so I think its reasonable.

            if (alias) {
                options.unshift(mergeAlias(alias, aliasObj, {env, argv}));
            }

            if (pluginName.startsWith('.')) {
                pluginName = join(includedFrom, pluginName)
            }

            this.plugins.set(pluginName, newOption(pluginName, pluginSrc, mergeOptions(options), parent, alias));
            return ret;
        };

        const processOpts = (name: string, config: OptionsConfig = {}, options: {}, pkg: Package, parent: Package, override?: boolean) => {

            //install first but don't load first.
            if (config.presets) {

                config.presets.forEach(p => {
                    const [presetName] = nameConfig(p);
                    //just do the check, the add happens later.
                    if (!seenPresets.has(presetName)) {
                        resolvePkgJson(presetName);
                    }
                });
            }

            if (config.plugins) {
                config.plugins.map(plugin => processPlugin(pkg.name, plugin, options, parent))
                    .forEach((eachPluginName) => {
                        typeof eachPluginName === 'string' && scan(config.ignoreRc, pkg, eachPluginName, void (0), override)
                    });
            }

            if (config.presets) {
                //presets all get the same configuration.
                config.presets.forEach(preset => {
                    const [presetName, presetConfig] = nameConfig(preset);
                    if (!seenPresets.has(presetName)) {
                        seenPresets.add(presetName);
                        if (presetConfig !== false) {
                            scan(config.ignoreRc, pkg, presetName, presetConfig, override);
                        }
                    }
                });
            }
        };

        const processEnv = (prefix = '') => {
            const pluginsName = `${prefix}PLUGINS`;
            const presetsName = `${prefix}PRESETS`;
            const envPlugins = plugins.concat(split(this.env(pluginsName, '')));
            const envPresets = presets.concat(split(this.env(presetsName, '')));

            if ((envPlugins.length || envPresets.length)) {
                this.debug('process from env', pluginsName, envPlugins, presetsName, envPresets);
                processOpts(`${envPrefix}_${prefix}ENV`, {
                    plugins: envPlugins,
                    presets: envPresets
                }, void (0), this.topPackage, void (0));
            }
        };


        const scan = (ignoreRc: boolean, parent: Package, name: string, options?: {}, override?: boolean) => {
            this.debug('scanning', name);

            if (Array.isArray(name)) {
                throw new Error(`${name} can not be an array import from ${parent && parent.name}`);
            }

            const pkg = resolvePkgJson(name);
            const pluginConf = resolveConfig(pkg);

            processOpts(name, pluginConf, options, pkg, parent, override);
        };


        processEnv();

        scan(false, this.topPackage, this.topPackage.name);

        //ALLOW for fallbacks when tooling wants to signal things.
        processEnv('INTERNAL_');

    }

    /**
     * Returns a logger for a plugin.  This object has warn,info,debug
     *
     * @param plugin
     */
    logger(plugin: string): Logger {
        const {warn, info, debug} = this.plugins.get(plugin) || this;
        return {
            warn,
            info,
            debug
        }
    }

    /**
     * Iterates over each option, passing the value, the name and other foreach style args.
     *
     * @param fn
     * @param scope
     */
    forEach(fn: ForEachFn<Option>, scope = {}) {
        this.plugins.forEach((value, key, ...args) => {
            if (value) {
                fn.call(scope, value, key, ...args);
            }
        });
    }

    config(name: string, def?: any): any {
        const parts = name.split('.', 2);
        const v = this.plugins.get(parts.shift());
        if (!v) {
            //if not enabled no default.
            return;
        }

        const config = v.config;
        const ret = parts.length ? get(config, parts) : config;
        return ret == null ? def : ret;
    }

    enabled(name: string) {
        return !!this.plugins.get(name);
    }

//make nice stringify
    toJSON() {
        return {
            name: this.topPackage.name,
            plugins: this.plugins
        }
    }

    /**
     * Tries to load each of the plugins, and configure them, with
     * plugin.call(scope, options, conf, optionsManager);   Where conf and
     * scope are passed as arguments.
     * @param conf
     * @param scope
     */
    async initialize<T>(conf: T, scope: {} | InitFn<T> = {}): Promise<T> {
        for (const [key, option] of this.plugins.entries()) {
            if (!option) {
                continue;
            }
            let plugin: Function;
            try {
                plugin = this.require(Array.isArray(option.plugin) ? option.plugin[0] : option.plugin || key);
            } catch (e) {
                if (e.code !== 'MODULE_NOT_FOUND') {
                    throw e;
                }
                option.warn(`was not found '${key}' from '${option && option.plugin}'`);
                continue;
            }
            if (typeof plugin === 'function') {
                try {
                    let ret;
                    if (typeof scope === 'function') {
                        ret = await scope(option, conf, this);
                    } else {
                        ret = await plugin.call(scope, option.config || {}, conf, this);
                    }
                    option.info('loaded.');
                    conf = ret || conf;
                } catch (e) {
                    console.trace(e);
                    option.warn(`Error in '${option.name}'`, e);
                    throw e;
                }
            } else if (plugin) {
                option.debug(`'${key}' not loaded no  plugin was found`);
            }
        }

        return conf;
    }
}


export class Option implements OptionType {
    constructor(public name: string,
                public plugin: PluginValue,
                public config: {},
                public optionsManager: OptionsManager,
                public parent?: Package,
                public alias?: AliasObj) {
    }

    get(key: string, def?: any): any {
        if (key) {
            return get(this.config, key, def);
        }
        return this.config;
    }

    debug = (...args: any[]): void => {
        this.optionsManager.log('DEBUG', this.name, ...args);
    };

    warn = (...args: any[]): void => {
        this.optionsManager.log('WARN', this.name, ...args);
    };

    info = (...args: any[]): void => {
        this.optionsManager.log('INFO', this.name, ...args);
    };

    toJSON() {
        return {
            name: this.name,
            plugin: typeof this.plugin === 'function' ? (this.plugin.name
                || '[function]')
                : this.plugin,
            config: this.config,
            parent: `[${this.parent && this.parent.name}]`
        }
    }
}

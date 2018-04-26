const cp                             = require('child_process');
const { basename, join, resolve }    = require('path');
const { get, parseJSON, parseValue } = require('mrbuilder-utils');
const {
          envify, mergeAlias, mergeArgs, mergeEnv, mergeOptions, mergePlugins,
          nameConfig, select, split
      }                              = require('./util');
const _help                          = require('./help');
const handleNotFoundTryInstall       = require('./handleNotFoundTryInstall');
const handleNotFoundFail             = (e, pkg) => {
    this.warn('could not require "%s/package.json" from "%s"',
        pkg,
        process.cwd()
    );
    throw e;
};



module.exports = class OptionsManager {


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
                    handleNotFound = handleNotFoundTryInstall
                } = {}) {
        const seenPresets = new Set();
        this.plugins = new Map();
        this.help    = _help(this);
        if (!prefix) {
            prefix = basename(argv[1]).split('-').shift()
        }
        prefix     = envify(prefix);
        envPrefix  = envPrefix || envify(prefix);
        confPrefix = confPrefix || prefix.toLowerCase();
        rcFile     = `.${confPrefix}rc`;

        this.require = _require;

        this.env = (key, def) => {
            const ret = env[key.toUpperCase()];
            if (ret === null || ret === void(0)) {
                return def;
            }
            return ret;
        };
        if (!handleNotFound || this.env(`${envPrefix}_NO_AUTOINSTALL`)) {
            handleNotFound = handleNotFoundFail;
        } else {
            handleNotFound = handleNotFoundTryInstall;
        }

        this.cwd        = (...paths) => resolve(this.env('MODULE_DIR', cwd()),
            ...paths);
        this.topPackage = topPackage || _require(this.cwd('package.json'));


        this.warn =
            (...args) => warn(`WARN [${prefix.toLowerCase()}]`, ...args);


        this.debug = (...args) => {
            if (!this.env('QUIET')) {
                if (this.env(`${envPrefix}_DEBUG`)) {
                    debug(`DEBUG [${prefix.toLowerCase()}]`, ...args);
                }
            }
        };

        this.info = (...args) => {
            if (!this.env('QUIET')) {
                info(`INFO [${prefix.toLowerCase()}]`, ...args);
            }
        };

        if (_require === require) {
            this.warn('require is not set, using default require');
        }
        const ENV_VAR = `${envPrefix}_ENV`;

        const ENV = this.env(ENV_VAR) || env.NODE_ENV;

        this.info(ENV_VAR, 'is', ENV || 'not set');
        this.debug('topPackage is', this.topPackage.name);

        const resolveFromPkgDir = (pkg, file, ...relto) => {
            if (!pkg || this.topPackage.name === pkg) {
                if (file === 'package.json') {
                    pkg = this.cwd(file);
                }
                return this.cwd(file, ...relto);
            }
            if (file === 'package.json') {
                return resolve(join(pkg, file))
            }
            return resolve(_require.resolve(join(pkg, 'package.json')), '..',
                file, ...relto);
        };
        const resolvePkgJson    = (pkg, retry = true) => {
            if (typeof pkg !== 'string') {
                return pkg;
            }
            if (pkg === this.topPackage.name) {
                return this.topPackage;
            } else {
                if (resolvePkgJson.cache.has(pkg)) {
                    return resolvePkgJson.cache.get(pkg);
                }

                const pkgPath = join(pkg, 'package.json');
                try {
                    if (!this.env(`${envPrefix}_NO_AUTOINSTALL`)) {
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
                                { stdio: 'ignore', cwd: cwd() });
                        }
                    }

                    const ret = parseJSON(_require.resolve(pkgPath));
                    resolvePkgJson.cache.set(pkg, ret);
                    return ret;
                } catch (e) {
                    //This should throw if it can't find it
                    //otherwise we try resolving again.
                    if (retry) {
                        handleNotFound.call(this, e, pkg);
                        return resolveConfig(pkg, false);
                    }

                    throw e;

                }
            }
        };

        resolvePkgJson.cache = new Map();

        const resolveConfig = (pkg) => {
            pkg = resolvePkgJson(pkg);

            const pluginConfig = pkg[confPrefix] ? parseValue(
                JSON.stringify(pkg[confPrefix]))
                                                 : parseJSON(
                resolveFromPkgDir(pkg.name, rcFile))
                                                   || {};

            const envOverride = pluginConfig.env
                                && pluginConfig.env[ENV] || {};
            return {
                presets : select(envOverride.presets, pluginConfig.presets),
                options : select(envOverride.options, pluginConfig.options),
                plugins : mergePlugins(envOverride.plugins,
                    pluginConfig.plugins),
                ignoreRc: select(envOverride.ignoreRc, pluginConfig.ignoreRc),
                plugin  : select(envOverride.plugin, pluginConfig.plugin),
                alias   : pluginConfig.alias

            };
        };


        const newOption = (name, plugin, config, parent, alias) => {
            if (config === false) {
                return false;
            }
            const opt          = new Option(name, plugin, config, parent,
                alias);
            opt.optionsManager = this;

            opt.info = (...args) => {
                info(`INFO [${prefix.toLowerCase()}:${name}]`, ...args);
            };

            opt.debug = (...args) => {
                if (this.env(`${envPrefix}_DEBUG`)) {
                    debug(`DEBUG [${prefix.toLowerCase()}:${name}]`,
                        ...args);
                }
            };

            opt.warn = (...args) => {
                warn(`WARN [${prefix.toLowerCase()}:${name}]`, ...args);
            };
            return opt;
        };

        const processPlugin = (includedFrom, plugin, override, parent) => {
            let [pluginName, pluginOpt] = nameConfig(plugin);
            const options               = [override, pluginOpt];
            let pluginSrc               = pluginName;
            let ret                     = pluginName;
            let alias;
            if (pluginName.startsWith('.')) {
                if (includedFrom === this.topPackage.name) {
                    pluginSrc = this.cwd(pluginName);
                } else {
                    pluginSrc = join(includedFrom, pluginName);
                }
                ret = false;
            } else {
                const [rPluginName, rPluginOpts] = nameConfig(plugin);

                options.push(rPluginOpts);

                const pConfig = resolveConfig(rPluginName);
                if (pConfig) {

                    if (pConfig.plugin) {
                        let [pluginPath, prPluginOpts] = nameConfig(
                            pConfig.plugin);

                        options.push(prPluginOpts);
                        if (pluginPath) {
                            if (rPluginName === this.topPackage.name) {
                                pluginSrc = this.cwd(pluginPath);
                            } else {
                                pluginSrc = join(rPluginName, pluginPath);
                            }
                        }
                    }
                    alias = pConfig.alias;
                }
            }

            if (this.plugins.has(pluginName)) {
                return;
            }
            //nothing enables a disabled plugin.


            options.unshift(mergeArgs(pluginName, argv));
            options.unshift(mergeEnv(pluginName, env));
            if (alias) {
                options.unshift(mergeAlias(alias, aliasObj, { env, argv }));
            }

            const resolvedOptions = mergeOptions(options);
            if (resolvedOptions === false) {
                this.plugins.set(pluginName, false);
                return;
            }
            if (pluginName.startsWith('.')) {
                pluginName = join(includedFrom, pluginName)
            }
            this.plugins.set(pluginName,
                newOption(pluginName, pluginSrc, resolvedOptions, parent,
                    alias));
            return ret;
        };
        const processOpts   = (name, {
            presets,
            plugins,
            ignoreRc
        } = {}, options, pkg, parent, override) => {

            //install first but don't load first.
            if (presets) {
                presets.forEach(p => resolvePkgJson(nameConfig(p)[0]));
            }

            if (plugins) {
                plugins.map(
                    plugin => processPlugin(pkg.name, plugin, override, pkg,
                        ignoreRc))
                       .filter(Boolean).forEach(
                    (pluginName) => scan(ignoreRc, pkg, pluginName, void(0),
                        override))
            }

            if (presets) {
                //presets all get the same configuration.
                presets.forEach(preset => {
                    const [presetName, config] = nameConfig(preset);
                    if (!seenPresets.has(presetName)) {
                        seenPresets.add(presetName);
                        scan(ignoreRc, pkg, presetName, void(0), config)
                    }
                });
            }
        };
        const processEnv    = (prefix = '') => {
            const pluginsName = `${envPrefix}_${prefix}PLUGINS`;
            const presetsName = `${envPrefix}_${prefix}PRESETS`;
            const plugins     = split(this.env(pluginsName, ''));
            const presets     = split(this.env(presetsName, ''));
            if ((plugins.length || presets.length)) {
                this.debug('process from env', pluginsName, plugins,
                    presetsName, presets);
                processOpts(`${envPrefix}_${prefix}ENV`,
                    { plugins, presets, plugin: false },
                    void(0),
                    this.topPackage);
            }
        };
        const scan          = (ignoreRc, parent, name, options, override) => {
            this.debug('scanning', name);

            if (Array.isArray(name)) {
                throw new Error(
                    `${name} can not be an array import from ${parent
                                                               && parent.name}`);
            }

            const pkg        = resolvePkgJson(name);
            const pluginConf = resolveConfig(pkg);

            processOpts(name, pluginConf, options, pkg, parent, override);
        };


        processEnv();

        scan(
            false,
            this.topPackage,
            this.topPackage.name
        );

        //ALLOW for fallbacks when tooling wants to signal things.
        processEnv('INTERNAL_');

    }

    logger(plugin) {
        const { warn, info, debug } = this.plugins.get(plugin) || this;
        return {
            warn,
            info,
            debug
        }
    }


    forEach(fn, scope = {}) {
        this.plugins.forEach((value, key, ...args) => {
            if (value) {
                fn.call(scope, value, key, ...args);
            }
        });
    }

    config(name, def) {
        const parts = name.split('.', 2);
        const key   = parts.shift();
        if (!this.enabled(key)) {
            //if not enabled no default.
            return;
        }
        const config = this.plugins.get(key).config;
        const ret    = parts.length ? get(config, parts) : config;
        return ret == null ? def : ret;
    }

    enabled(name) {
        return !!this.plugins.get(name);
    }

//make nice stringify
    toJSON() {
        return {
            name   : this.topPackage.name,
            plugins: this.plugins
        }
    }
};

class Option {
    constructor(name,
                plugin,
                config,
                parent,
                alias) {
        this.name   = name;
        this.plugin = plugin;
        this.config = config;
        this.parent = parent;
        this.alias  = alias;
    }


    toJSON() {
        return {
            name  : this.name,
            plugin: typeof this.plugin === 'function' ? (this.plugin.name
                                                         || '[function]')
                                                      : this.plugin,
            config: this.config,
            parent: `[${this.parent && this.parent.name}]`
        }
    }
}

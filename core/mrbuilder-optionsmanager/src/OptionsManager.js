import { basename, join, resolve } from 'path';
import {
    configOrBool, get, info, parseJSON, parseValue, set, warn
} from 'mrbuilder-utils';
import { merge, mergeAlias, nameConfig, select } from './util';

const split = (value = '') => (Array.isArray(value) ? value
    : value.split(/,\s*/)).filter(Boolean);

export const DEFAULT_ALL = ['DEBUG',
    'ENABLE',
    'DISABLE',
    'PLUGINS',
    'PRESETS',
    'MODULE_DIR'
];

export default class OptionsManager {

    plugins = new Map();

    constructor({
                    prefix,
                    envPrefix,
                    confPrefix,
                    rcFile,
                    all = DEFAULT_ALL,
                    env = process.env,
                    argv = process.argv,
                    cwd = process.cwd,
                    info = console.info || console.warn,
                    warn = console.warn,
                    _require = require
                } = {}) {
        if (!prefix) {
            prefix = basename(argv[1]).split('-').shift()
        }
        prefix       = prefix.toUpperCase();
        envPrefix    = envPrefix || prefix.toUpperCase();
        confPrefix   = confPrefix || prefix.toLowerCase();
        rcFile       = `.${confPrefix}rc`;
        this.require = _require;

        this.env = (key, def) => {
            const ret = env[key.toUpperCase()];
            if (ret === null || ret === void(0)) {
                return def;
            }
            return ret;
        };

        this.cwd        = (...paths) => resolve(this.env('MODULE_DIR', cwd()),
            ...paths);
        this.topPackage = _require(this.cwd('package.json'));


        this.warn = (...args) => {
            warn(`WARN [${prefix.toLowerCase()}]`, ...args);

        };

        this.info = (...args) => {
            if (this.env(`${envPrefix}_DEBUG`)) {
                info(`INFO [${prefix.toLowerCase()}]`, ...args);
            }
        };

        this.info('NODE_ENV is', env.NODE_ENV || 'not set');
        this.info('topPackage is ', this.topPackage.name);

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

        const resolveConfig = (pkg) => {
            if (typeof pkg === 'string') {
                if (pkg === this.topPackage.name) {
                    pkg = this.topPackage;
                } else {
                    try {
                        pkg = _require(join(pkg, 'package.json'));
                    } catch (e) {
                        console.warn(
                            'could not require "%s/package.json" from "%s"',
                            pkg,
                            process.cwd()
                        );
                        throw e;
                    }
                }
            }
            const pluginConfig = pkg[confPrefix]
                                 || parseJSON(
                    resolveFromPkgDir(pkg.name, rcFile))
                                 || {};

            const envOverride = pluginConfig.env
                                && pluginConfig.env[env.NODE_ENV] || {};
            return {
                presets : select(envOverride.presets, pluginConfig.presets),
                options : select(envOverride.options, pluginConfig.options),
                plugins : select(envOverride.plugins, pluginConfig.plugins),
                ignoreRc: select(envOverride.ignoreRc, pluginConfig.ignoreRc),
                plugin  : select(envOverride.plugin, pluginConfig.plugin),
            };
        };


        const newOption     = (name, plugin, config, parent, alias) => {
            if (config === false) {
                return false;
            }
            const opt          = new Option(name, plugin, config, parent,
                alias);
            opt.optionsManager = this;
            return opt;
        };
        let aliasObj        = {};
        const processPlugin = (includedFrom, plugin, override, parent) => {
            let [pluginName, pluginOpts = override] = nameConfig(plugin);
            let pluginSrc               = pluginName;
            let ret                     = pluginName;
            let alias;
            if (pluginName.startsWith('.')) {
                pluginSrc = join(includedFrom, pluginName);
                ret       = false;
            } else {
                const pConfig = resolveConfig(plugin);
                if (pConfig) {
                    let [rPluginName, rPluginOpts = pluginOpts] = nameConfig(
                        pConfig.plugin);
                    if (rPluginName) {
                        pluginSrc  = join(plugin, rPluginName);
                        pluginOpts = rPluginOpts;
                    }
                    alias = pConfig.alias;
                }

            }

            if (this.plugins.has(pluginName)) {
                return;
            }
            //nothing enables a disabled plugin.
            if (pluginOpts === false) {
                this.plugins.set(pluginName, false);
                return;
            }


            pluginOpts = merge(pluginName, pluginOpts, { env, argv });
            if (alias) {
                pluginOpts = mergeAlias(alias, aliasObj, { env, argv });
            }
            this.plugins.set(pluginName,
                newOption(pluginName, pluginSrc, pluginOpts, parent, alias));
            return ret;
        };

        const processOpts = (name, {
            presets,
            plugins,
            ignoreRc
        } = {}, options, pkg, parent, override) => {
            if (plugins) {
                plugins.map(plugin => {
                    return processPlugin(pkg.name, plugin, override, pkg);
                }).filter(Boolean).forEach((pluginName) => {
                    scan(ignoreRc, pkg, pluginName, void(0), override);
                })
            }

            if (presets) {
                //presets all get the same configuration.
                presets.forEach(preset => {
                    const [presetName, config] = nameConfig(preset);
                    scan(ignoreRc, pkg, presetName, void(0), config)
                });
            }
        };
        const processEnv  = (prefix = '') => {
            const pluginsName = `${envPrefix}_${prefix}PLUGINS`;
            const presetsName = `${envPrefix}_${prefix}PRESETS`;
            const plugins     = split(this.env(pluginsName, ''));
            const presets     = split(this.env(presetsName, ''));
            if ((plugins.length || presets.length)) {
                this.info('process from env', pluginsName, plugins,
                    presetsName, presets);
                processOpts(`${envPrefix}_${prefix}ENV`,
                    { plugins, presets, plugin: false },
                    void(0),
                    this.topPackage);
            }
        };
        const scan        = (ignoreRc, parent, name, options, override) => {
            this.info('scanning', name);

            const pkg = name === this.topPackage.name ? this.topPackage
                : _require(`${name}/package.json`);
            if (Array.isArray(name)) {
                throw new Error(
                    `${name} can not be an array import from ${parent
                                                               && parent.name}`);

            }

            const pluginConf = resolveConfig(pkg);


            processOpts(name, pluginConf, options, pkg, parent,
                override);
        };


        processEnv();
        scan(false, this.topPackage, this.topPackage.name);
        //ALLOW for fallbacks when tooling wants to signal things.
        processEnv('INTERNAL_');

    }


    config(name, def) {
        const parts = name.split('.', 2);
        const key   = parts.shift();
        if (!this.enabled(key)) {
            //if not enabled no default.
            return;
        }
        const config = this.plugins.get(key).config;
        return get(config, parts.shift(), def);
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
}

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

    info(...args) {
        (this.optionsManager || console).info(`- ${this.name}`,
            ...args);
    }

    warn(...args) {
        (this.optionsManager || console).warn(`- ${this.name}`, ...args);
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

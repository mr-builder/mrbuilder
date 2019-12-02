import {configOrBool, parseValue, set} from '@mrbuilder/utils';
import {
    AliasObj,
    EnvConfig,
    NameOrPluginNameConfig,
    OptionsConfig,
    OptionValueObj,
    PluginNameConfig,
    PresetsPlugins
} from "./types";

type FalseOrObject = false | { [key: string]: any }

export const select = (...args: any[]): any => {
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] !== void (0)) {
            return args[i];
        }
    }
};

export const split = (v: string | string[] = []): string[] => (Array.isArray(v) ? v : v.split(/,\s*/)).filter(Boolean);


/**
 * Merges options. If an option if false, than we return false.
 *
 * @type {function(*): *}
 */
export const mergeOptions = (options: FalseOrObject[]): FalseOrObject => {
    let ret = {};
    for (let i = options.length - 1; i > -1; i--) {
        const opt = options[i];
        if (opt === false) {
            return false;
        }
        if (opt != null) {
            ret = Object.assign(ret, opt);
        }
    }
    return ret;
};

export const mergePlugins = (...mergedPlugins: NameOrPluginNameConfig[][]): PluginNameConfig[] => {
    const c: PluginNameConfig[] = [];
    if (!mergedPlugins.length) {
        return c;
    }

    return mergedPlugins.reduce<PluginNameConfig[]>((ret, plugins: NameOrPluginNameConfig[]) => {
        plugins.forEach(c => {
            const plugin: PluginNameConfig = typeof c === 'string' ? [c] : c;
            const pluginName = plugin[0];
            if (!ret.find(b => b[0] === pluginName)) {
                ret.push(plugin);
            }
        });
        return ret;
    }, c);
};

export const camel = (v = '', idx?: number): string => !v ? v : `${idx > 0 ? v[0].toUpperCase()
    : v[0].toLowerCase()}${v.substring(1).toLowerCase()}`;

const parse = (value: string, name: string) => {
    try {
        return parseValue(value);
    } catch (e) {
        console.warn('error parsing "%s" in [%s]', value, name, e);
        return;
    }
};


export const mergeEnv = (plugin: string, env = process.env): FalseOrObject => {
    const upperPlugin = envify(plugin);
    if (upperPlugin in env) {
        const value = configOrBool(env[upperPlugin]);
        if (value === false || value === true) {
            return value;
        }
        return parse(value, plugin);
    }
    return {};
};

export const fixName = (name: string, sep = '-'): string => name.replace(/^@/, '').replace(/[^\w]{1,}/g, sep);

export const envify = (name: string): string => fixName(name, '_').toUpperCase();

type ArgObj = { [key: string]: any }
export const parseArgs = (args: string[] = process.argv): ArgObj => {
        const ret: ArgObj = {};
        for (let i = 2, l = args.length; i < l; i++) {
            const arg = args[i];
            if (arg.startsWith('-')) {
                let [key, value] = arg.replace(/^--?/, '').split('=', 2);
                if (value) {
                    ret[key] = parseValue(value);
                } else {
                    if (arg[i + 1].startsWith('-')) {
                        ret[key] = true;
                    } else {
                        let v: any = [];
                        for (let j = i + 1; j < l; j++) {
                            if (!args[j].startsWith('-')) {
                                v.push(parseValue(args[j]))
                            }
                        }
                        ret[key] = v;
                    }
                }
            }
        }

        return ret;
    }
;

export const mergeArgs = (plugin: string, argv = process.argv): FalseOrObject => {

    const copy = [];
    let ret = {};
    for (let i = 2, l = argv.length; i < l; i++) {
        let arg = argv[i];

        if (arg.startsWith('--')) {
            const argPart = arg.substring(2);
            let offset = -1;
            if (argPart === plugin || argPart.startsWith(plugin + '.') || argPart.startsWith(plugin + '=')) {
                offset = plugin.length;
            } else {
                //allow for non scoped command line arguments to continue working.
                //--mrbuilder-plugin-stuff and --@mrbuilder/plugin-stuff are equivalent
                const normalizePlugin = fixName(plugin);
                //can be exact or '.' or '=' but can't be anything else
                if (argPart === normalizePlugin || argPart.startsWith(normalizePlugin + '.') || argPart.startsWith(normalizePlugin + '=')) {
                    offset = normalizePlugin.length;
                }
            }

            if (offset !== -1) {
                const remainingArgKey = argPart.substring(offset);
                if (remainingArgKey.includes('=')) {
                    const parts = remainingArgKey.split('=', 2).filter(Boolean);

                    if (parts.length === 1) {
                        return parse(parts[0], arg);
                    }
                    set(ret, parts[0], parts.length ? parse(parts[1], argPart) : true);
                } else {

                    const collect = [];
                    for (let j = i + 1; j < l && !argv[j].startsWith('-'); i++, j++) {
                        collect.push(parse(argv[j], arg));
                    }
                    const remainingArgKeyRest = remainingArgKey.substring(1);
                    if (remainingArgKeyRest) {
                        set(ret, remainingArgKeyRest, collect.length === 1 ? collect[0] : collect.length === 0 ? true : collect);
                    } else {
                        return collect.length === 1 ? collect[0] : collect;
                    }
                }

                continue;
            }
        }
        copy.push(arg);
    }
    argv.splice(2, argv.length, ...copy);
    return ret;
};

export type OptionsObj = {
    [key: string]: any
}

export const mergeAliasEnv = (aliases: string[] | { [key: string]: any }, options: OptionsObj | false, {env}: Process = process): OptionsObj => {
    aliases = Array.isArray(aliases) ? aliases : Object.keys(aliases);
    if (options === false) {
        options = {};
    }
    const keys = Object.keys(env);
    for (let i = 0, l = keys.length; i < l; i++) {
        const ukey = keys[i];
        const key = ukey.split('_').map(camel).join('');

        if (aliases.includes(key)) {
            if ((ukey in env)) {
                if (env[ukey] == null) {
                    options[key] = true;
                } else {
                    options[key] = parse(env[keys[i]], key);
                }
            }
        }

    }
    return options;
};

export const mergeAliasArgs = (aliases: string[], options: OptionsObj | false, {argv}: Process = process) => {
    if (options === false) {
        options = {};
    }
    const copy = [];
    for (let i = 2, l = argv.length; i < l; i++) {
        let arg = argv[i];
        let argKey = null;
        if (arg.length === 2 && arg.startsWith('-')) {
            argKey = arg.substring(1);
        } else if (arg.startsWith('--')) {
            argKey = arg.substring(2)
        }

        if (argKey) {
            const parts = argKey.split('=', 2);
            const key = parts.shift().split('-').map(camel).join('');
            if (aliases.includes(key)) {
                if (parts.length) {
                    set(options, key, parts.length ? parse(parts[0], arg) : true);
                } else {

                    const collect = [];
                    for (let j = i + 1; j < l && !argv[j].startsWith('-'); i++, j++) {
                        collect.push(parse(argv[j], arg));
                    }
                    set(options, key, collect.length === 1 ? collect[0] : collect.length === 0 ? true : collect);
                }
                continue;
            }
        }
        copy.push(arg);
    }
    argv.splice(2, argv.length, ...copy);
    return options;
};

type Process = {
    env: { [key: string]: any }, argv: string[]
}

export const mergeAlias = (alias: string[] | AliasObj = [],
                           aliasObj: OptionsObj,
                           process: Process): OptionsObj => {

    const options: OptionsObj = {};
    const aliases = (Array.isArray(alias) ? alias : Object.keys(alias));

    //already got the value;

    aliasObj = mergeAliasArgs(aliases, aliasObj, process);
    aliasObj = mergeAliasEnv(aliases, aliasObj, process);
    aliases.forEach(function (key) {
        if (aliasObj[key] !== void (0)) {
            options[key] = aliasObj[key];
        }
    });
    return options;
};


const unique$reduce = <T>(ret: T[], v: T): T[] => {
    if (!(v == null || ret.includes(v))) {
        ret.push(v);
    }
    return ret;
};

export const unique = <T>(arr: T[]): T[] => arr.reduce(unique$reduce, []);


export const resolveEnv = <K extends keyof PresetsPlugins>(envName: string, key: K, config: OptionsConfig): PresetsPlugins[K][] => {
    const ret: PresetsPlugins[K][] = [];
    if (!config) {
        return ret;
    }


    if (envName && config.env) {
        const envs: string[] = unique([...envName.split(':'), envName].filter(Boolean));
        for (let i = 0, l = envs.length; i < l; i++) {
            const envName = envs[i];
            const e: PresetsPlugins = config.env[envName];
            if (e && e[key]) {
                ret.push(e[key]);
            }
        }
    }

    if (config[key]) {
        ret.push(config[key]);
    }

    return ret;

};

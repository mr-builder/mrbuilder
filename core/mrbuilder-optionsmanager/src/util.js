import { configOrBool, parseValue, set, toUnderscore } from 'mrbuilder-utils';

export const select = (...args) => {
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] !== void(0)) {
            return args[i];
        }
    }
};
export const split  = (value = []) => (Array.isArray(value) ? value
    : value.split(/,\s*/)).filter(Boolean);

export const nameConfig = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
};


export const camel = (v = '', idx) => !v ? v : `${idx > 0 ? v[0].toUpperCase()
    : v[0].toLowerCase()}${v.substring(1)
                            .toLowerCase()}`;

export const parse = (value, name) => {
    try {
        return parseValue(value);
    } catch (e) {
        console.warn('error parsing "%s" in [%s]', value, name, e);
        return;
    }
};

export const envify = (str) => str.toUpperCase().replace(/[-.]/g, '_');

export const mergeEnv = (plugin, env = process.env) => {
    let ret = {};

    const upperPlugin = envify(plugin);
    const keys        = Object.keys(env);
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        if (key === upperPlugin) {
            const value = configOrBool(env[key]);
            if (value === false) {
                return false;
            } else {
                ret = parse(value, plugin);
            }
        }
        if (key.startsWith(upperPlugin)) {
            const keyPart   = key.substring(upperPlugin.length + 1);
            const camelName = keyPart.split('_').map(camel).join('');
            set(ret, camelName, parse(env[key], plugin));
        }
    }
    return ret;
};

export const mergeArgs     = (plugin, argv = process.argv) => {

    const copy = [];
    let ret    = {};
    for (let i = 2, l = argv.length; i < l; i++) {
        let arg = argv[i];

        if (arg.startsWith('--')) {
            const argPart = arg.substring(2);
            if (argPart.startsWith(plugin)) {
                const parts = argPart.substring(plugin.length + 1)
                                     .split('=', 2);
                const key   = parts.shift().split('-').map(camel).join('');
                if (parts.length) {
                    set(ret, key,
                        parts.length ? parse(parts[0], argPart) : true);
                } else {

                    const collect = [];
                    for (let j = i + 1; j < l && !argv[j].startsWith('-');
                         i++, j++) {
                        collect.push(parse(argv[j], arg));
                    }
                    set(ret, key,
                        collect.length === 1 ? collect[0] : collect.length === 0
                            ? true : collect);
                }

                continue;
            }
        }
        copy.push(arg);
    }
    argv.splice(2, argv.length, ...copy);
    return ret;
};
export const mergeAliasEnv = (aliases, options, { env } = process) => {
    aliases = Array.isArray(aliases) ? aliases : Object.keys(aliases);
    if (options === false) {
        options = {};
    }
    const keys = Object.keys(env);
    for (let i = 0, l = keys.length; i < l; i++) {
        const ukey = keys[i];
        const key  = ukey.split('_').map(camel).join('');

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

export const mergeAliasArgs = (aliases, options, { argv } = process) => {
    if (options === false) {
        options = {};
    }
    const copy = [];
    for (let i = 2, l = argv.length; i < l; i++) {
        let arg    = argv[i];
        let argKey = null;
        if (arg.length === 2 && arg.startsWith('-')) {
            argKey = arg.substring(1);
        } else if (arg.startsWith('--')) {
            argKey = arg.substring(2)
        }

        if (argKey) {
            const parts = argKey.split('=', 2);
            const key   = parts.shift().split('-').map(camel).join('');
            if (aliases.includes(key)) {
                if (parts.length) {
                    set(options, key,
                        parts.length ? parse(parts[0], arg) : true);
                } else {

                    const collect = [];
                    for (let j = i + 1; j < l && !argv[j].startsWith('-');
                         i++, j++) {
                        collect.push(parse(argv[j], arg));
                    }
                    set(options, key,
                        collect.length === 1 ? collect[0] : collect.length === 0
                            ? true : collect);

                }
                continue;
            }
        }
        copy.push(arg);
    }
    argv.splice(2, argv.length, ...copy);
    return options;
};

export const mergeAlias = (alias = [],
                           aliasObj,
                           process) => {

    const options = {};
    const aliases = (Array.isArray(alias) ? alias
        : Object.keys(alias));

    //already got the value;

    aliasObj = mergeAliasArgs(aliases, aliasObj, process);
    aliasObj = mergeAliasEnv(aliases, aliasObj, process);
    aliases.forEach(function (key) {
        if (aliasObj[key] !== void(0)) {
            options[key] = aliasObj[key];
        }
    });
    return options;
};




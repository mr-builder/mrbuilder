const { configOrBool, parseValue, set } = require('mrbuilder-utils');

const select = module.exports.select = (...args) => {
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] !== void(0)) {
            return args[i];
        }
    }
};

const split = module.exports.split =
    (value = []) => (Array.isArray(value) ? value
        : value.split(/,\s*/)).filter(Boolean);

const nameConfig = module.exports.nameConfig = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
};

const mergeOptions = module.exports.mergeOptions = (options) => {
    const ret = {};
    for (let i = options.length - 1; i >= 0; i--) {
        const opt = options[i];
        if (opt === false) {
            return false;
        }
        if (opt == null) {
            continue;
        }
        Object.keys(opt).reduce(function (ret, key) {
            if (opt[key] !== void(0)) {
                ret[key] = opt[key];
            }
            return ret;
        }, ret);
    }
    return ret;
};

const asArray = module.exports.asArray = v => Array.isArray(v) ? v : [v];

const mergePlugins = module.exports.mergePlugins =
    (envPlugins, basePlugins = []) => {
        if (!envPlugins) {
            return basePlugins;
        }
        envPlugins  = envPlugins.map(asArray);
        basePlugins = basePlugins.map(function (plugin) {
            plugin      = asArray(plugin);
            const found = envPlugins.findIndex(v => v[0] === plugin[0]);
            if (found > -1) {
                return envPlugins.splice(found, 1)[0];
            }
            return plugin;
        });

        basePlugins.push(...envPlugins);
        return basePlugins;
    };

const camel = module.exports.camel =
    (v = '', idx) => !v ? v : `${idx > 0 ? v[0].toUpperCase()
        : v[0].toLowerCase()}${v.substring(1)
                                .toLowerCase()}`;

const parse = module.exports.parse = (value, name) => {
    try {
        return parseValue(value);
    } catch (e) {
        console.warn('error parsing "%s" in [%s]', value, name, e);
        return;
    }
};

const envify = module.exports.envify =
    (str) => str.toUpperCase().replace(/[-.]/g, '_');

const mergeEnv = module.exports.mergeEnv = (plugin, env = process.env) => {
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

const mergeArgs = module.exports.mergeArgs = (plugin, argv = process.argv) => {

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
const mergeAliasEnv = module.exports.mergeAliasEnv =
    (aliases, options, { env } = process) => {
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

const mergeAliasArgs = module.exports.mergeAliasArgs =
    (aliases, options, { argv } = process) => {
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
                            collect.length === 1 ? collect[0] : collect.length
                                                                === 0
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

const mergeAlias = module.exports.mergeAlias = (alias = [],
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




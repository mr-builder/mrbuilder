const {configOrBool, parseValue, set} = require('@mrbuilder/utils');

const select = module.exports.select = (...args) => {
    for (let i = 0, l = args.length; i < l; i++) {
        if (args[i] !== void (0)) {
            return args[i];
        }
    }
};

const split = module.exports.split = (v = []) => (Array.isArray(v) ? v : v.split(/,\s*/)).filter(Boolean);

const nameConfig = module.exports.nameConfig = (value) => Array.isArray(value) ? value : value == null ? [] : [value];

/**
 * Merges options. If an option if false, than we return false.
 *
 * @type {function(*): *}
 */
const mergeOptions = module.exports.mergeOptions = (options) => {
    let ret;
    for (let i = options.length - 1; i >= 0; i--) {
        const opt = options[i];
        if (opt === false) {
            return false;
        }
        ret = Object.assign(ret && ret !== true ? ret : {}, opt);
    }
    return ret;
};

const asArray = module.exports.asArray = v => Array.isArray(v) ? v : v == null ? [] : [v];

const mergePlugins = module.exports.mergePlugins = (...mplugins) => {
    if (!mplugins.length) {
        return mplugins;
    }
    return mplugins.reduce((ret, plugin) => {
        plugin      = asArray(plugin);
        const found = ret.findIndex(v => v[0] === plugin[0]);
        if (found === -1) {
            ret.push(plugin);
        }
        return ret;
    }, []);
};

const camel = module.exports.camel = (v = '', idx) => !v ? v : `${idx > 0 ? v[0].toUpperCase()
    : v[0].toLowerCase()}${v.substring(1).toLowerCase()}`;

const parse = module.exports.parse = (value, name) => {
    try {
        return parseValue(value);
    } catch (e) {
        console.warn('error parsing "%s" in [%s]', value, name, e);
        return;
    }
};


const mergeEnv = module.exports.mergeEnv = (plugin, env = process.env) => {
    const upperPlugin = fixName(plugin, '_').toUpperCase();
    if (upperPlugin in env) {
        const value = configOrBool(env[upperPlugin]);
        if (value === false || value === true) {
            return value;
        }
        return parse(value, plugin);
    }
    return {};
};

const fixName = (name, sep = '-') => name.replace(/^@/, '').replace(/[^\w]{1,}/g, sep);

const mergeArgs     = module.exports.mergeArgs = (plugin, argv = process.argv) => {

    const copy = [];
    let ret    = {};
    for (let i = 2, l = argv.length; i < l; i++) {
        let arg = argv[i];

        if (arg.startsWith('--')) {
            const argPart = arg.substring(2);
            let offset    = -1;
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
                        return parse(parts[0])
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
const mergeAliasEnv = module.exports.mergeAliasEnv =
    (aliases, options, {env} = process) => {
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

const mergeAliasArgs = module.exports.mergeAliasArgs = (aliases, options, {argv} = process) => {
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

const mergeAlias = module.exports.mergeAlias = (alias = [],
                                                aliasObj,
                                                process) => {

    const options = {};
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


const unique$reduce = (ret, v) => {
    if (!(v == null || ret.includes(v))) {
        ret.push(v);
    }
    return ret;
};

const unique = module.exports.unique = arr => arr.reduce(unique$reduce, []);

const resolveEnv = module.exports.resolveEnv = (envName, type, config = {}) => {
    const ret = [];

    if (envName && config.env) {
        const envs = unique([envName, ...envName.split(':')]);
        for (let i = 0, l = envs.length; i < l; i++) {
            const e = config.env[envs[i]];
            if (e && e[type]) {
                ret.push(...e[type]);
            }
        }
    }
    if (config[type]) {
        ret.push(...config[type]);
    }
    return ret;
};

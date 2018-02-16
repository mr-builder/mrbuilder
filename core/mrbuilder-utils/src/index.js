const path                         = require('path');
const { existsSync, readFileSync } = require('fs');
const {
          stringify,
          parseValue,
          parseRe,
      }                            = require('./parse');
//JSON5 allows for a lot more convienent syntax.
const JSON5                        = require('json5');
const {
          SUBSCHEMA_PROJECT_DIR
              = process.cwd(),
          SUBSCHEMA_DEBUG
      }                            = process.env;

const asArray = Function.call.bind(
    Array.prototype.slice);

const cwd = (...args) =>
    path.resolve(SUBSCHEMA_PROJECT_DIR, ...args);

const project   = cwd;
const parseJSON = (filename) => {
    if (!existsSync(filename)) {
        return;
    }
    const file = readFileSync(filename) + '';
    return JSON5.parse(file, parseRe);
};

function resolvePkgDir(name, file, ...rest) {

    if (file === 'package.json') {
        return require.resolve(path.join(name, 'package.json'));
    }
    if (file) {
        return path.resolve(
            require.resolve(path.join(name, 'package.json')), '..', file,
            ...rest);
    }
    return path.resolve(require.resolve(path.join(name, 'package.json')), '..');
}

const PKG_CACHE = {};

function pkg() {

    const _pkg = cwd('package.json');

    if (PKG_CACHE[_pkg]) {
        return PKG_CACHE[_pkg]
    }

    debug(`using package`, _pkg);
    return (PKG_CACHE[_pkg] = require(_pkg));

}


function debug(...args) {
    if (configOrBool(SUBSCHEMA_DEBUG)) {
        console.log('[mrbuilder]', ...args);
    }
}

function warn() {
    console.warn.apply(console, asArray(arguments));
}

function info() {
    const value = configOrBool(SUBSCHEMA_DEBUG);
    if (value > 1) {
        console.warn.apply(console, asArray(arguments));
    }
}

function set(obj, key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    let cobj   = obj || {};
    while (keys.length) {
        const c = keys.shift();
        cobj    = cobj[c] || (cobj[c] = {});
    }
    obj[last] = value;
    return obj;
}

function get(obj, key, def) {
    if (key == null) {
        return obj == null ? def : obj;
    }
    if (obj == null) {
        return def;
    }
    const paths = Array.isArray(key) ? key.concat() : key.split('.');
    let ret     = obj;
    while (paths.length) {
        if (!obj) {
            return def;
        }
        ret = obj[paths.shift()];
    }
    return ret == null ? def : ret;
}

function applyFuncs(f1, f2) {
    f1 = f1 && (f1.default ? f1.default : f1);
    f2 = f2 && (f2.default ? f2.default : f2);
    if (!f2) {
        return wrapFunc(f1);
    }
    if (!f1 && f2) {
        return wrapFunc(f2);
    }
    if (!f1 && !f2) {
        return null;
    }
    f1 = wrapFunc(f1);
    f2 = wrapFunc(f2);
    return function (opts, conf) {
        //keep scope.
        return f1.call(this, opts, (f2.call(this, opts, conf)));
    }
}


function configOrBool(value, defaultValue) {
    if (value == null) {
        return false;
    }

    switch (String(value).trim().toLowerCase()) {
        case '':
        case 'false':
        case '0':
            return false;
        case 'true':
        case '1':
            return defaultValue || true;
        default:
            return value;
    }
}

const camelCased = function (str, first) {
    str = str.replace(/[.-]([a-z])/g, function (g) {
        return g[1] && g[1].toUpperCase();
    });
    if (first) {
        return `${str[0].toUpperCase()}${str.substring(1)}`;
    }
    return str;
};

const camelToHyphen = (str = '') => str.replace(/([A-Z])/g,
    (g, a, i) => `${i === 0 ? '' : '-'}${g[0].toLowerCase()}`);
const sliced        = Function.call.bind(Array.prototype.slice);


function resolveMap(...args) {
    return args.reduce(function (ret, key) {
        ret[key] = resolvePkgDir(key);
        return ret;
    }, {});
}


function parseEntry(entryNoParse) {
    if (!entryNoParse) {
        return;
    }
    if (!(typeof entryNoParse === 'string' || Array.isArray(entryNoParse))) {
        return Object.keys(entryNoParse).reduce(function (ret, key) {
            const val = entryNoParse[key];
            ret[key]  = Array.isArray(val) ? val.map(v => enhancedResolve(v))
                : [enhancedResolve(val)];
            return ret;
        }, {});
    }
    let entry        = {};
    const entryArray = Array.isArray(entryNoParse) ? entryNoParse
        : typeof entryNoParse === 'string' ? entryNoParse.split(/,\s*/)
                           : entryNoParse;


    for (let i = 0, l = entryArray.length; i < l; i++) {
        const parts = entryArray[i].split('=', 2);
        let key     = parts[0], value = parts[1];
        if (!value) {
            value = key;
            key   = path.basename(key).replace(/([^.]*$)/, '');
        }
        if (entry[key]) {
            if (Array.isArray(entry[key])) {
                entry[key].push(enhancedResolve(value));
            } else {
                entry[key] = [entry[key], enhancedResolve(value)];
            }
        } else {
            entry[key] = enhancedResolve(value);
        }
    }
    return entry;
}

const enhancedResolve = (p) => {
    if (p.startsWith('.')) {
        return cwd(p);
    }
    if (p.startsWith('~')) {
        const parts  = p.substring(1).split('/');
        const pkgDir = path.resolve(
            require.resolve(path.join(parts.shift(), 'package.json')), '..');

        return path.resolve(pkgDir, ...parts);
    }
    return p;
};

module.exports = {
    parseValue,
    stringify,
    get,
    set,
    camelCased,
    project,
    pkg,
    configOrBool,
    applyFuncs,
    parseEntry,
    enhancedResolve,
    debug,
    warn,
    parseJSON,
    info,
    cwd, sliced, resolveMap, resolvePkgDir, camelToHyphen

};

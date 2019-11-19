export {default as lernaFilteredPackages} from "./lernaFilteredPackages";
export * from './parse';

import path from 'path';
import {existsSync, readFileSync} from "fs";
import JSON5 from 'json5';

import {
    parseRe,
} from './parse';
//JSON5 allows for a lot more convienent syntax.

export const cwd = (...args: string[]): string => {
    return path.join(process.cwd(), ...args);
};

export const project = cwd;

export const parseJSON = (filename: string): {} => {
    if (!existsSync(filename)) {
        return;
    }
    const file = readFileSync(filename) + '';
    return JSON5.parse(file, parseRe);
};

export function resolvePkgDir(name: string, file?: string, ...rest: string[]): string {

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

const PKG_CACHE: { [key: string]: string } = {};

export function pkg(): string {

    const _pkg = cwd('package.json');

    if (PKG_CACHE[_pkg]) {
        return PKG_CACHE[_pkg]
    }

    return (PKG_CACHE[_pkg] = require(_pkg));

}

export function set(aobj: {} | boolean, key: string, value: any): {} | false {
    if (aobj === false) {
        return aobj;
    }
    let obj = aobj === true ? {} : aobj || {};
    const keys = key.split('.').filter(Boolean);
    const last = camelCased(keys.pop());
    let cobj: { [key: string]: any } = obj;
    while (keys.length) {
        const c = camelCased(keys.shift(), false);
        cobj = cobj[c] || (cobj[c] = {});
    }
    cobj[last] = value;
    return obj;
}

export function get(obj: {}, key: string | string[], def?: any): any {
    if (key == null) {
        return obj == null ? def : obj;
    }
    if (obj == null) {
        return def;
    }
    const paths: string[] = Array.isArray(key) ? key.concat() : key.split('.');
    let ret: any = obj;
    while (paths.length) {
        if (!ret) {
            return def;
        }
        ret = ret[paths.shift()];
    }
    return ret == null ? def : ret;
}


export function configOrBool(value: string | boolean, defaultValue?: boolean): any {
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

export const camelCased = function (str: string, first?: boolean): string {
    str = str.replace(/[.-]([a-z])/g, function (g) {
        return g[1] && g[1].toUpperCase();
    });
    if (first) {
        return `${str[0].toUpperCase()}${str.substring(1)}`;
    }
    return str;
};

export const camelToHyphen = (str = '') => str.replace(/([A-Z])/g,
    (g, a, i) => `${i === 0 ? '' : '-'}${g[0].toLowerCase()}`);


export type StringMap = { [key: string]: string };

export function resolveMap(...args: string[]): StringMap {
    return args.reduce(function (ret: StringMap, key: string) {
        ret[key] = resolvePkgDir(key);
        return ret;
    }, {});
}

type Entry = {
    [key: string]: string[]
}

export function parseEntry(entryNoParse?: string | string[] | { [key: string]: string | string[] }): Entry {
    if (!entryNoParse) {
        return;
    }
    if (!(typeof entryNoParse === 'string' || Array.isArray(entryNoParse))) {
        return Object.keys(entryNoParse).reduce(function (ret: Entry, key: string) {
            const val = entryNoParse[key];
            ret[key] = Array.isArray(val) ? val.map(v => enhancedResolve(v))
                : [enhancedResolve(val)];
            return ret;
        }, {});
    }
    let entry: Entry = {};
    const entryArray = Array.isArray(entryNoParse) ? entryNoParse
        : typeof entryNoParse === 'string' ? entryNoParse.split(/,\s*/)
            : entryNoParse;


    for (let i = 0, l = entryArray.length; i < l; i++) {
        const parts = entryArray[i].split('=', 2);
        let key = parts[0], value = parts[1];
        if (!value) {
            value = key;
            key = path.basename(key).replace(/([^.]*$)/, '');
        }
        entry[key] = [...(entry[key] || []), enhancedResolve(value)];
    }
    return entry;
}

export const enhancedResolve = (p: string, _require = require): string => {
    if (p.startsWith(path.sep)) {
        return p;
    }
    if (p.startsWith('.')) {
        return cwd(p);
    }
    if (p.startsWith('~')) {
        const parts = p.substring(1).split(path.sep);
        const pkg = parts.shift();
        try {
            const pkgDir = path.resolve(_require.resolve(path.join(pkg, 'package.json')), '..');

            return path.resolve(pkgDir, ...parts);
        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                console.warn(`Could not resolve ${pkg} from ${p} check spelling and location`);
            }
            throw e;
        }
    }
    return p;
};
type RegExOrFn = ((str: string) => boolean) | RegExp;

export const regexOrFuncApply = (first?: RegExOrFn, second?: RegExOrFn): RegExOrFn => {
    if (!first) {
        return second;
    }
    if (!second) {
        return first;
    }
    return (test: string) => {
        if (first instanceof RegExp) {
            if (first.test(test)) {
                return true;
            }
        } else {
            if (first(test)) {
                return true;
            }
        }
        if (second instanceof RegExp) {
            return second.test(test);
        }
        return second(test);
    }
};
//
// module.exports = {
//     parseValue,
//     stringify,
//     get,
//     set,
//     camelCased,
//     project,
//     pkg,
//     configOrBool,
//     applyFuncs,
//     parseEntry,
//     enhancedResolve,
//     debug,
//     warn,
//     regexOrFuncApply,
//     parseJSON,
//     info,
//     cwd, sliced, resolveMap, resolvePkgDir, camelToHyphen, lernaFilteredPackages
//
// };

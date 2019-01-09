#!/usr/bin/env node
const fs          = require('fs');
const JSON5       = require('json5');
const write       = process.argv.includes('--write');
const rename      = process.argv.includes('--rename');
const version     = (idx => (idx && process.argv[idx]))(process.argv.indexOf('--version') + 1);
const MRBIULDERRC = `${process.env.PWD}/.mrbuilderrc`;
const PACKAGE     = `${process.env.PWD}/package.json`;

function fixName(name, prefix = '@mrbuilder/') {
    return name.replace(/^(mrbuilder[-.]?)(.*)/, (_, f, postfix) => prefix + (postfix || 'cli'));
}

function fixDep(obj) {
    if (!obj) return obj;
    return Object.keys(obj).reduce(function (ret, key) {
        const fixed = fixName(key);
        if (fixed !== key) {
            ret[fixName(key)] = version || obj[key];
        } else {
            ret[key] = obj[key];
        }
        return ret;
    }, {})
}

function fixPlugins(arr) {
    if (!arr) {
        return arr;
    }
    return arr.map(v => {
        if (Array.isArray(v)) {
            return [fixName(v[0]), v[1]];
        }
        return fixName(v);
    })
}

function fixMrbuilder(config) {
    const mrbuilder = Object.assign({}, config);

    if (config.plugins) {
        mrbuilder.plugins = fixPlugins(config.plugins);
    }
    if (config.presets) {
        mrbuilder.presets = fixPlugins(config.presets);
    }
    if (config.env) {
        mrbuilder.env = Object.keys(config.env).reduce(function (ret, key) {
            if (config.env[key].plugins) {
                if (!ret[key]) {
                    ret[key] = {};
                }
                ret[key].plugins = fixPlugins(config.env[key].plugins)
            }
            if (config.env[key].presets) {
                if (!ret[key]) {
                    ret[key] = {};
                }
                ret[key].presets = fixPlugins(config.env[key].presets)
            }
            return ret;
        }, {});
    }
    return mrbuilder;
}

function fixPackage(pkgFile = PACKAGE) {
    if (!fs.existsSync(pkgFile)) {
        return;
    }
    const pkg = require(pkgFile);
    ['dependencies', 'peerDependencies', 'devDependencies'].map(k => {
        if (k in pkg) {
            pkg[k] = fixDep(pkg[k]);
        }
    });

    if (rename) {
        pkg.name = fixName(pkg.name);
        if (version) {
            pkg.version = version.replace(/^[^~]/, '');
        }
    }

    if (pkg.mrbuilder) {
        pkg.mrbuilder = fixMrbuilder(pkg.mrbuilder);
    }
    const out = JSON.stringify(pkg, null, 2);
    if (write) {
        fs.writeFileSync(pkgFile, out, 'utf-8');
        console.log(`wrote ${pkgFile}`);
    } else {
        console.log(`${pkgFile}:\n`, out);
    }
}

function fixMrbuilderrc(rcFile = MRBIULDERRC) {
    if (!fs.existsSync(rcFile)) {
        return;
    }
    const conf = JSON.stringify(fixMrbuilder(JSON5.parse(fs.readFileSync(rcFile))), null, 2);
    if (write) {
        fs.writeFileSync(rcFile, conf, 'utf-8');
        console.log(`wrote ${rcFile}`);

    } else {
        console.log(`${rcFile}:\n`, conf);
    }
}

if (typeof module != 'undefined' && !module.parent) {
    fixMrbuilderrc();
    fixPackage();
} else {
    module.exports = {
        fixMrbuilderrc,
        fixPackage,
        fixName,
    }
}


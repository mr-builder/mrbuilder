const path           = require('path');
const fs             = require('fs');
const basename       = path.basename.bind(path);
const relative       = path.relative.bind(path);
const dirname        = path.dirname.bind(path);
const resolve        = path.resolve.bind(path);
const currentPkgName = require(resolve(process.cwd(), 'package.json')).name;
const lc             = Function.call.bind(String.prototype.toLowerCase);
const hyphenize      = v => v.replace(/([A-Z])/g, (g) => `-${lc(g[0])}`)
                             .replace(/^-/, '');
const loaderUtils = require("loader-utils");

const cs = (v, delim = '_') => {
    let ret = v.replace(/\/|[.]/g, delim);
    while (ret.startsWith(delim)) {
        ret = ret.substring(1);
    }
    return ret.replace(new RegExp(`${delim}${delim}`, 'g'), delim);
};

const makeOptions = (filepath, context, extension) => {
    const idx = filepath.lastIndexOf('node_modules');
    if (idx != -1) {
        try {
            let pkgPath = filepath;
            while ((pkgPath = dirname(pkgPath)) && pkgPath != '/') {
                if (fs.existsSync(resolve(pkgPath, 'package.json'))) {
                    break;
                }
            }
            const pkgName  = require(resolve(pkgPath, 'package.json')).name;
            const relName  =
                      cs(relative(resolve(pkgPath, 'node_modules'), filepath));

            const baseName = basename(filepath, extension);

            return {
                'package-name': pkgName,
                'rel-name'    : relName,
                'base-name'   : cs(baseName)
            }
        } catch (e) {

            const relName = basename(relative(process.cwd(), filepath));
            return {
                'package-name': relName,
                'base-name'   : cs(basename(relName, extension))

            }
        }
    }
    return {
        'package-name': currentPkgName,
        'base-name'   : cs(basename(filepath, extension)),

    };

};
const formatters  = {
    hyphen: hyphenize,
};

function getLocalIdent(loaderContext,
                       localIdentName,
                       localName,
                       options = {}) {

    if (!options.context) {
        options.context = loaderContext.options
                          && typeof loaderContext.options.context
                             === "string"
            ? loaderContext.options.context
            : loaderContext.context;
    }
    const request = path.relative(options.context, loaderContext.resourcePath);
    options.content = options.hashPrefix + request + "+" + localName;

    const ctx = makeOptions(loaderContext.resourcePath,
        options.context, options.extension || '.stylm');

    ctx['local'] = localName;

    localIdentName = loaderUtils.interpolateName(loaderContext, localIdentName, options);
    console.log('localIdentName',localIdentName)

    localIdentName = localIdentName.replace(/\[([^\]]*)]/g, (a, m) => {
        let parts = m && m.split(':', 2);
        if (ctx[m]) {
            return ctx[m];
        }
        if (parts.length === 2 && ctx[parts[1]]) {
            return formatters[parts[0]](ctx[parts[1]]);
        }
        return  `[${m}]`
    });

    return localIdentName.replace(
        new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-")
                         .replace(/^((-?[0-9])|--)/, "_$1");

}

module.exports = getLocalIdent;

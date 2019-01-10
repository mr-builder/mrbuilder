const path           = require('path');
const basename       = path.basename.bind(path);
const relative       = path.relative.bind(path);
const resolve        = path.resolve.bind(path);
const currentPkgName = require(resolve(process.cwd(), 'package.json')).name;
const lc             = Function.call.bind(String.prototype.toLowerCase);
const hyphenize      = v => v.replace(/([A-Z])/g, (g) => `-${lc(g[0])}`)
                             .replace(/^-/, '');
const loaderUtils    = require("loader-utils");
const findPackage    = require('find-package');
const cs             = (v, delim = '_') => {
    let ret = v.replace(/\/|[.]/g, delim);
    while (ret.startsWith(delim)) {
        ret = ret.substring(1);
    }
    return ret.replace(new RegExp(`${delim}${delim}`, 'g'), delim);
};

const makeOptions = (filepath, context, extension) => {
    try {
        let pkg = findPackage(filepath, true);

        const pkgName = pkg && pkg.name;

        const baseName = basename(filepath, extension);

        return {
            'package-name': pkgName,
            'base-name'   : cs(baseName),
            'rel-name'    : cs(path.relative(pkg && pkg.paths.absolute, filepath)),
        }
    } catch (e) {

        const relName = basename(relative(process.cwd(), filepath));
        return {
            'package-name': relName,
            'base-name'   : cs(basename(relName, extension))

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
    const request   = path.relative(options.context,
        loaderContext.resourcePath);
    options.content = options.hashPrefix + request + "+" + localName;

    const ctx = makeOptions(loaderContext.resourcePath,
        options.context, options.extension || '.stylm');

    ctx['local'] = localName;

    localIdentName =
        loaderUtils.interpolateName(loaderContext, localIdentName, options);

    localIdentName = localIdentName.replace(/\[([^\]]*)]/g, (a, m) => {
        let parts = m && m.split(':', 2);
        if (ctx[m]) {
            return ctx[m];
        }
        if (parts.length === 2 && ctx[parts[1]]) {
            return formatters[parts[0]](ctx[parts[1]]);
        }
        return `[${m}]`
    });

    return localIdentName.replace(
        new RegExp("[^a-zA-Z0-9\\-_\u00A0-\uFFFF]", "g"), "-")
                         .replace(/^((-?[0-9])|--)/, "_$1");

}

module.exports = getLocalIdent;

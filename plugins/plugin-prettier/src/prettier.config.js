const {optionsManager, Info} = require('@mrbuilder/cli');
const {enhancedResolve, logObject} = require('@mrbuilder/utils');
const tryResolve = (file) => {
    try {
        return enhancedResolve(file, optionsManager.require);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return;
        }
        throw e;
    }
}

// (.prettierrc, package.json, prettier.config.js)
const _resolveConfig = () => {
    const rcFile = tryResolve('~/.prettierrc');
    if (rcFile) {
        return require(rcFile);
    }
    const pkg = tryResolve('~/package.json');

    if (pkg && pkg.prettier) {
        return pkg.prettier;
    }

    const config = tryResolve('~/prettier.config.js');

    if (config) {
        return require(config);
    }

    const conf = optionsManager.config('@mrbuilder/plugin-prettier');

    if (optionsManager.enabled('@mrbuilder/plugin-stylus')) {
        if (!conf.overrides) {
            conf.overrides = [];
        }
        // conf.overrides.push({
        //     files: "*.styl*",
        //     excludeFiles: ["**/**"],
        //     options: {parser: "css"}
        // });
        // conf.overrides.push({
        //     files: "src/**/*.stylm",
        //     excludeFiles: ["**/*.stylm"],
        //     options: {parser: "css"}
        // });
    }

    if (optionsManager.config('@mrbuilder/plugin-css.modules')) {
        if (!conf.overrides) {
            conf.overrides = [];
        }
        conf.overrides.push({
            files: "*.cssm",
            options: {"parser": "css"}
        });

    }



    return conf;
}

function resolveConfig() {
    const {test, ...conf} = _resolveConfig();
    logObject("prettier config", Info.isDebug, conf);
    return conf;
}

module.exports = resolveConfig();
const {optionsManager} = require('@mrbuilder/cli');
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

    return optionsManager.config('@mrbuilder/plugin-prettier');
}

function resolveConfig() {
    const {test, ...conf} = _resolveConfig();
    return conf;
}

module.exports = resolveConfig();
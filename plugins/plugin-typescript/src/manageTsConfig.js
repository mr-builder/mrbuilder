const {enhancedResolve} = require("@mrbuilder/utils");
const fs = require('fs');

module.exports = (optionsManager) => {
    if (!optionsManager.enabled('@mrbuilder/plugin-typescript')) {
        return;
    }
    const isManaged = optionsManager.config('@mrbuilder/plugin-typescript.managed', false);

    const configFile = optionsManager.config('@mrbuilder/plugin-typescript.configFile', enhancedResolve('@mrbuilder/plugin-typescript/tsconfig.mrbuilder.json'));
    const tsConfig = optionsManager.config('@mrbuilder/plugin-typescript.tsconfig') || require(configFile);
    const tsPath = optionsManager.cwd('tsconfig.json');
    if (!fs.existsSync(tsPath) || (isManaged && JSON.stringify(tsConfig) !== JSON.stringify(require(tsPath)))) {
        optionsManager.logger('@mrbuilder/plugin-typescript').info(`updating ${tsPath}`);
        fs.writeFileSync(tsPath, JSON.stringify(tsConfig, null, 2), 'utf8');
    }
};
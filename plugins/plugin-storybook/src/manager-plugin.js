const om = require('@mrbuilder/cli').default;

async function managerWebpack(config, options) {
    // update config here
    return config;
}

async function managerBabel(config, options) {
    // update config here
    return config;
}

async function webpack(config, options) {
    return config;
}

async function babel(config, options) {
    return config;
}

async function addons(entry = []) {
    const r=  entry.concat(om.config('@mrbuilder/plugin-storybook.addons', []).map(v => require.resolve(v)));
    return r;
}

module.exports = {managerWebpack, managerBabel, webpack, babel, addons}

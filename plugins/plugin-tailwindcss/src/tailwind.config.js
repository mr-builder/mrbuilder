const om = require('@mrbuilder/cli').default;

const {plugins, ...rest} = om.config('@mrbuilder/plugin-tailwindcss.config');

if (plugins) {
    rest.plugins = plugins.map(v => typeof v === 'string' ? require(v) : v);
}

module.exports = rest;

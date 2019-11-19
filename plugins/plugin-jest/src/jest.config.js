#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
let om = global._MRBUILDER_OPTIONS_MANAGER;
if (!global._MRBUILDER_OPTIONS_MANAGER) {
    process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;
    om = global._MRBUILDER_OPTIONS_MANAGER = new (require('@mrbuilder/optionsmanager').default)({
        prefix: 'mrbuilder',
        _require: require
    });
}
const {defaults} = require('jest-config');
const fs = require('fs');

const jestConfig = {
    ...defaults,
    rootDir: process.cwd() + '/src',
    //allow for configuration override
    ...(om.config('@mrbuilder/plugin-jest') || void (0))
};

if (!jestConfig.transform) {
    jestConfig.transform = {};
}

if (om.enabled('@mrbuilder/plugin-filetypes')) {
    const types = om.config('@mrbuilder/plugin-filetypes.test');
    if (types) {
        jestConfig.transform[types.source ? types.source : types] = `@mrbuilder/plugin-jest/src/mediaFileTransformer.js`;
    }
}

if (om.enabled('@mrbuilder/plugin-babel')) {
    if (!fs.existsSync(om.cwd('babel.config.js'))) {
        jestConfig.transform ['\.[jt]sx?'] = om.require.resolve('@mrbuilder/plugin-jest/src/transform');
    }
}

if (om.enabled('@mrbuilder/plugin-graphql')) {
    const test = om.config('@mrbuilder/plugin-graphql.test', '\.g(raph)?qls?$');
    jestConfig.transform[test instanceof RegExp ? test.source : test] = 'jest-transform-graphql';
    try {
        require('jest-transform-graphql');
    } catch (e) {
        console.warn(`need to manually add 'jest-transform-graphql' to your dependencies`);
        throw e;
    }

}

const assignIdentity = (plugin, def) => {
    const cssModule = om.config(`${plugin}.test`, def);
    if (cssModule) {
        jestConfig.moduleNameMapper[cssModule instanceof RegExp ? cssModule.source : cssModule] = 'identity-obj-proxy';
    }
};

if (om.config('@mrbuilder/plugin-css.modules', true)) {
    assignIdentity('@mrbuilder/plugin-css', '\.cssm?');
    assignIdentity('@mrbuilder/plugin-less', '\.lessm?');
    assignIdentity('@mrbuilder/plugin-sass', '\.sassm?');
}

if (om.enabled('@mrbuilder/plugin-version')) {
    Object.assign(jestConfig.globals, require('@mrbuilder/plugin-version/src/version')(om.config('@mrbuilder/plugin-version')));
}

module.exports = jestConfig;
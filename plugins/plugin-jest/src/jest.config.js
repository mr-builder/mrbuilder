#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;
const om = require('@mrbuilder/cli').default;
const {defaults} = require('jest-config');
const fs = require('fs');
const logger = om.logger('@mrbuilder/plugin-jest');
const jestConfig = {
    ...defaults,
    rootDir: om.cwd('src'),
    //allow for configuration override
    ...(om.config('@mrbuilder/plugin-jest'))
};

if (!jestConfig.transform) {
    jestConfig.transform = {};
}

const loader = (rule) => {
    const use = Array.isArray(rule.use) ? rule.use[0] : rule.use;
    return typeof use == 'string' ? use : use.loader;
};

if (om.enabled('@mrbuilder/plugin-webpack')) {
    if (global._MRBUILDER_WEBPACK) {
        const webpackConf = global._MRBUILDER_WEBPACK;
        if (!jestConfig.moduleNameMapper) {
            jestConfig.moduleNameMapper = {};
        }
        if (!jestConfig.transform) {
            jestConfig.transform = {};
        }
        if (webpackConf.resolve && webpackConf.resolve.alias) {

            Object.entries(webpackConf.resolve.alias).forEach(([key, value]) => {
                if (/react/.test(value)) {
                    return;
                } else if (key.endsWith('/')) {
                    key += '(.*)';
                    value += '/$1';
                }
                jestConfig.moduleNameMapper[key] = value;
            });
        }
        if (webpackConf.module.rules) {
            webpackConf.module.rules.sort((a, b) => {
                //babel-loader needs to happen last.
                const aloader = loader(a), bloader = loader(b);
                if (aloader === bloader) {
                    return 0;
                }
                if (aloader === 'babel-loader') {
                    return 1;
                }

                return -1;

            }).map(rule => {
                if (rule.test) {
                    switch (loader(rule)) {
                        case 'babel-loader':
                            jestConfig.transform[rule.test.source || rule.test] = om.require.resolve('@mrbuilder/plugin-jest/src/transform');
                            break;
                        case 'url-loader':
                        case 'file-loader':
                            jestConfig.transform[rule.test.source || rule.test] = `@mrbuilder/plugin-jest/src/mediaFileTransformer.js`;
                            break;
                        case 'style-loader':
                            jestConfig.moduleNameMapper[rule.test.source || rule.test] = 'identity-obj-proxy';
                            break;
                        case 'graphql-loader':
                            jestConfig.transform[rule.test.source || rule.test] = 'jest-transform-graphql';
                            try {
                                require('jest-transform-graphql');
                            } catch (e) {
                                console.warn(`need to manually add 'jest-transform-graphql' to your dependencies`);
                                throw e;
                            }
                            break;
                        default:
                            logger.warn('no jest config for ', JSON.stringify(rule));
                    }

                }
            });
        }
    } else {
        throw new Error(`it appears that webpack was not initialized first, please use the mrbuilder-jest cli to ensure operation`)
    }
} else if (om.enabled('@mrbuilder/plugin-babel') || om.enabled('@mrbuilder/plugin-typescript')) {
    if (!fs.existsSync(om.cwd('babel.config.js'))) {
        jestConfig.transform ['\.[jet]sx?'] = om.require.resolve('@mrbuilder/plugin-jest/src/transform');
    }
}


if (om.enabled('@mrbuilder/plugin-version')) {
    Object.assign(jestConfig.globals, require('@mrbuilder/plugin-version/src/version')(om.config('@mrbuilder/plugin-version')));
}

module.exports = jestConfig;
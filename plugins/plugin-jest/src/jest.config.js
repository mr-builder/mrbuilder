#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;
const {optionsManager, Info} = require('@mrbuilder/cli');
const {logObject, enhancedResolve} = require("@mrbuilder/utils");
const logger = optionsManager.logger('@mrbuilder/plugin-jest');
const {defaults} = require('jest-config');
const mrb = (key, def) => optionsManager.config(!key ? '@mrbuilder/plugin-jest' : `@mrbuilder/plugin-jest.${key}`, def);
const enabled = (key) => optionsManager.enabled(`@mrbuilder/plugin-${key}`);
const mrbConf = {...(mrb())};
delete mrbConf['@babel'];

const jestConfig = {
    ...defaults,
    coverageDirectory: enhancedResolve(mrb('coverageDirectory', './coverage'), optionsManager.resolve),
    rootDir: mrb('@mrbuilder/cli.src', optionsManager.cwd('src')),
    //allow for configuration override
    ...mrbConf
};
const escapeRe = str => str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

const isTypescript = enabled('typescript');
const isBabel = enabled('babel');
const isWebpack = enabled('webpack');

if (!jestConfig.transform) {
    jestConfig.transform = {};
}

const loader = (rule) => {
    const use = Array.isArray(rule.use) ? rule.use[0] : rule.use;
    return typeof use == 'string' ? use : use.loader;
};

if (isWebpack) {
    if (!global._MRBUILDER_WEBPACK) {
        throw new Error(`it appears that webpack was not initialized first, please use the mrbuilder-jest cli to ensure operation`)
    }
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
            } else if (key.endsWith('$')) {
                jestConfig.moduleNameMapper[`^${escapeRe(key.replace(/\$$/))}$`] = `${value}`;
            } else {
                if (key.endsWith('/')) {
                    jestConfig.moduleNameMapper[`^${escapeRe(key)}(.*)$`] = `${value}$1`;
                } else if (!/[.]js|mjs|ts|tsx|es\d+?$/.test(value)) {
                    jestConfig.moduleNameMapper[`^${escapeRe(key)}([/].*)?$`] = `${value}$1`;
                }

                jestConfig.moduleNameMapper[`^${escapeRe(key)}$`] = `${value}`;
            }
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
                        jestConfig.transform[rule.test.source || rule.test] = optionsManager.require.resolve('@mrbuilder/plugin-jest/transform');
                        break;
                    case 'url-loader':
                    case 'file-loader':
                        jestConfig.transform[rule.test.source || rule.test] = `@mrbuilder/plugin-jest/mediaFileTransformer`;
                        break;
                    case 'style-loader':
                        jestConfig.moduleNameMapper[rule.test.source || rule.test] = 'identity-obj-proxy';
                        break;
                    case 'graphql-tag/loader':
                    //fall through
                    case 'graphql-loader':
                        try {
                            jestConfig.transform[rule.test.source || rule.test] = optionsManager.require.resolve('jest-transform-graphql');
                        } catch (e) {
                            console.warn(`need to manually add 'jest-transform-graphql' to your dependencies`);
                            throw e;
                        }
                        break;
                    default:
                        logObject('no jest config', true, rule);
                }
            }
        });
    }
}
const tsUseBabel = isTypescript && optionsManager.config('@mrbuilder/plugin-typescript.useBabel');

if (isBabel) {
    const match =
        tsUseBabel ?
            /[.]mjs|js|jsx|ts|tsx|es\d|esx/ :
            optionsManager.config('@mrbuilder/plugin-babel.test', /[.]mjs|js|jsx|es\d|esx$/);
    jestConfig.transform [match.source] = optionsManager.require.resolve('@mrbuilder/plugin-jest/transform');
}

if (isTypescript && !tsUseBabel) {
    try {
        require.resolve('ts-jest');
        jestConfig.preset = 'ts-jest';
    } catch (e) {
        logger.warn(`please add 'ts-jest' to your package.json, or use babel to compile typescript '${JSON.stringify([
            "@mrbuilder/plugin-typescript",
            {
                "useBabel": true,
            }
        ], null, 2)}'`);

        jestConfig.transform [/[.]tsx?$/.source] = optionsManager.require.resolve('@mrbuilder/plugin-jest/transform');
    }
}


if (enabled('version')) {
    Object.assign(jestConfig.globals, require('@mrbuilder/plugin-version/version')(optionsManager.config('@mrbuilder/plugin-version')));
}
logObject('jest configuration', Info.isDebug, jestConfig);
module.exports = jestConfig;
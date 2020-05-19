process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-jest`;
const {optionsManager, Info} = require('@mrbuilder/cli');
const {logObject, enhancedResolve} = require("@mrbuilder/utils");
const logger = optionsManager.logger('@mrbuilder/plugin-jest');
const {defaults} = require('jest-config');
const mrb = (key, def) => optionsManager.config(!key ? '@mrbuilder/plugin-jest' : `@mrbuilder/plugin-jest.${key}`, def);
const enabled = (key) => optionsManager.enabled(`@mrbuilder/plugin-${key}`);
const mrbConf = {...(mrb())};
const fs = require('fs');
delete mrbConf['@babel'];


const coverageDirectory = enhancedResolve(mrb('coverageDirectory', './coverage'), optionsManager.resolve);

const jestConfig = {
    ...defaults,
    coverageDirectory,
    rootDir: mrb('@mrbuilder/cli.src', optionsManager.cwd('src')),
    //allow for configuration override
    ...mrbConf
};
if (mrbConf.rootDir) {
    jestConfig.rootDir = enhancedResolve(mrbConf.rootDir, optionsManager.require);
}

mrbConf.setupFilesAfterEnv = mrbConf.setupFilesAfterEnv && mrbConf.setupFilesAfterEnv.map(v => {
    return enhancedResolve(v.replace('<root>', jestConfig.rootDir), optionsManager.resolve);
}).filter(v => fs.existsSync(v));

const escapeRe = str => str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

const isTypescript = enabled('typescript');
const isBabel = enabled('babel');
const isWebpack = enabled('webpack');

if (!jestConfig.transform) {
    jestConfig.transform = {};
}
const loaderName = (u) => {
    if (Array.isArray(u)) {
        return u[0] && (u[0].loader || u[0]);
    }
    return u.loader || u;
}
const loader = ([rule, use]) => use;

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
        webpackConf.module.rules
            .reduce((ret, rule) => {
                ret.push(...(rule.test ?
                    (Array.isArray(rule.test) ? rule.test : [rule.test]).map(t => ([t, loaderName(rule.use)])) :
                    rule.oneOf ? rule.oneOf.map((v) => [v.test, loaderName(v.use)]) : []));
                return ret;
            }, [])

            .sort((a, b) => {
                //babel-loader needs to happen last.
                const aloader = loader(a), bloader = loader(b);
                if (aloader === bloader) {
                    return 0;
                }
                if (aloader === 'babel-loader') {
                    return 1;
                }

                return -1;

            }).forEach(([test, type]) => {
            if (test) {
                switch (type) {
                    case 'babel-loader':
                        jestConfig.transform[test.source || test] = optionsManager.require.resolve('@mrbuilder/plugin-jest/transform');
                        break;
                    case 'url-loader':
                    case 'file-loader':
                        jestConfig.transform[test.source || test] = `@mrbuilder/plugin-jest/mediaFileTransformer`;
                        break;
                    case 'style-loader':
                        jestConfig.moduleNameMapper[test.source || test] = 'identity-obj-proxy';
                        break;
                    case 'graphql-tag/loader':
                    //fall through
                    case 'graphql-loader':
                        try {
                            jestConfig.transform[test.source || test] = optionsManager.require.resolve('jest-transform-graphql');
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
        logger.warn(`Please add 'ts-jest' to your package.json, or use babel to compile typescript '${JSON.stringify([
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
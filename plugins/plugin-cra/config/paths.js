'use strict';

const path = require('path');
const fs = require('fs');
const {optionsManager} = require('@mrbuilder/cli');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const {enhancedResolve} = require('@mrbuilder/utils');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = (p = process.cwd()) => fs.existsSync(p) ? fs.realpathSync(p) : null;
const mrb = (k, def) => optionsManager.config(`@mrbuilder/plugin-cra${k ? `.${k}` : ''}`, def);
const crb = (k, def) => optionsManager.config(`@mrbuilder/cli${k ? `.${k}` : ''}`, def);

const resolveApp = (relativePath, ...keys) => {
    for (const key of keys) {

        const rkey = optionsManager.config(key);
        if (rkey) {
            const absPath = enhancedResolve(rkey, optionsManager.resolve);
            if (fs.existsSync(absPath)) {
                return appDirectory(absPath);
            }
        }
    }
    return enhancedResolve(relativePath, optionsManager.resolve);
}


// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    mrb('publicUrl', crb('publicUrl')),
    process.env.PUBLIC_URL
);

const moduleFileExtensions = mrb('moduleFileExtensions', optionsManager.config('@mrbuilder/plugin-webpack.extensions', [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
]));

const noDot = v => v.replace(/^[.]/, '');
// Resolve file paths in the same order as webpack
const resolveModule = (filePath, ...rest) => {
    for (const key of rest) {
        const v = optionsManager.config(key);
        if (!v) {
            continue;
        }
        const extension = moduleFileExtensions.map(noDot).find(extension =>
            fs.existsSync(`${v}.${extension}`)
        );

        if (extension) {
            return `${filePath}.${extension}`;
        }
    }
    return `${filePath}.js`;

};

// config after eject: we're in ./config/
module.exports = {
    dotenv: resolveApp('./.env', '@mrbuilder/plugin-cra.dotenv'),
    appPath: resolveApp('.', '@mrbuilder/plugin-cra.appPath'),
    appBuild: resolveApp('./build', '@mrbuilder/plugin-cra.appBuild'),
    appPublic: resolveApp('./public', '@mrbuilder/plugin-cra.appPublic'),
    appHtml: resolveApp('./public/index.html', '@mrbuilder/plugin-cra.appHtml'),
    appIndexJs: resolveModule('./src/index', '@mrbuilder/plugin-webpack.entry'),
    appPackageJson: resolveApp('./package.json', '@mrbuilder/plugin-cra.appPackageJSON'),
    appSrc: resolveApp('./src', '@mrbuilder/plugin-cli.src'),
    appTsConfig: resolveApp('./tsconfig.json', '@mrbuilder/plugin-cra.tsconfigJSON'),
    appJsConfig: resolveApp('./jsconfig.json', '@mrbuilder/plugin-cra.jsconfigJSON'),
    yarnLockFile: resolveApp('./yarn.lock'),
    testsSetup: resolveModule('./src/setupTests', '@mrbuilder/plugin-cra.setupTests'),
    proxySetup: resolveApp('./src/setupProxy.js', '@mrbuilder/plugin-cra.setupProxy'),
    appNodeModules: resolveApp('./node_modules', '@mrbuilder/plugin-cra.appNodeModules'),
    publicUrlOrPath,
    moduleFileExtensions
};

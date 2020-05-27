const fs = require('fs');
const {exec: _exec} = require('child_process');
const {promisify} = require('util');
const exec = promisify(_exec);
const versionOf = (val) => `"@mrbuilder/${val}": "${require('./package.json').devDependencies[`@mrbuilder/${val}`]}"`;
const required = (v) => v && v.length ? true : `is required`;
const niceString = (v) => v == null || v === '' || /^[a-zA-Z0-9-_]+?$/.test(v) || `'${v}' is not valid can only be '[a-Z0-9_-]'`;
const exists = (v) => fs.existsSync(v) ? `'${v}' already exists` : true;
const apply = (...fns) => v => fns.reduce((ret, fn) => ret !== true ? ret : fn(v), true);

module.exports = function (plop) {
    // create your generators here
    plop.setHelper('cwd', process.cwd);
    plop.setActionType('install', function (answers) {
        return `success\nplease run
 $ cd ${answers.namespace}     
 $ ${answers.useYarn ? 'yarn install' : 'npm install -g lerna\n $ lerna init\n $ lerna bootstrap\n'}`;
    });
    plop.setHelper('versionOf', versionOf);
    plop.setHelper('scoped-namespace', ({data: {root: {namespace, scope}}}) => scope ? `${scope}/${namespace}` : namespace);
    plop.setGenerator('monorepo', {
        description: 'This is sets up a mrbuilder monorepo',
        prompts: [
            {
                type: 'input',
                name: 'namespace',
                message: 'what namespace prefix do you want to use?',
                validate: apply(required, niceString, exists),
            },
            {
                type: 'input',
                name: 'scope',
                message: 'what "@scope" do you want to use (optional)',
                validate: v => niceString(v.replace(/^@/, '')),
                async default(v) {
                    try {
                        const result = await exec(`yarn config get scope`);
                        if (result.stdout && result.stdout !== 'undefined') {
                            return result.stdout && result.stdout.trim();
                        }
                    } catch (e) {
                        //it was only a guess.
                    }
                    return `@${v.namespace}`
                },
                filter(v) {
                    return v ? v.startsWith('@') ? v : `@${v}` : '';
                }
            },

            {
                type: 'input',
                name: 'packages',
                message: 'what directory would you like to put your packages?',
                default: 'packages',
                validate: apply(required, niceString),
            }, {
                type: 'input',
                name: 'version',
                message: 'what version would you like to start?',
                default: '0.0.1'
            }, {
                type: 'input',
                name: 'upstream',
                message: 'what do you call your git origin for push?',
                default: 'origin',
                validate: apply(required, niceString),

            }, {
                type: 'confirm',
                name: 'useYarn',
                message: 'use yarn?',
                default: 'y'
            }], // array of inquirer prompts
        actions: [
            {
                type: 'addMany',
                templateFiles: './templates/*',
                base: './templates',
                destination: '{{cwd}}/{{namespace}}'
            },
            {
                type: 'addMany',
                templateFiles: './templates/.*',
                base: './templates',
                destination: '{{cwd}}/{{namespace}}'
            },
            {
                type: 'addMany',
                templateFiles: './templates/builder/**/*',
                base: './templates/builder',
                destination: '{{cwd}}/{{namespace}}/builder'
            },
            {
                type: 'addMany',
                templateFiles: './templates/packages/**/*',
                base: './templates/packages',
                destination: '{{cwd}}/{{namespace}}/{{packages}}'
            }, {
                type: 'install'
            }
        ]
    });
};

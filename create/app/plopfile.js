const versionOnly = (val) => require(`./package.json`).devDependencies[`@mrbuilder/${val}`];
const versionOf   = (val) => `"@mrbuilder/${val}": "${versionOnly(val)}"`;
const execa       = require('execa');
const chalk       = require('chalk')
const {join}      = require('path');

const PROMPTS = [
    {
        type    : 'input',
        name    : 'packageName',
        message : "What is the name of your package?",
        validate: function (value) {
            return /.+/.test(value) ? true : 'packageName is required';
        }
    },
    {
        type   : 'input',
        name   : 'Component',
        message: 'What is the name of your component?',
        default(ans) {
            const c = ans.packageName.replace(/-([a-zA-Z])/g, (a, v) => v.toUpperCase());
            return c[0].toUpperCase() + c.substring(1);
        }
    },
    {
        type   : 'input',
        name   : 'description',
        message: 'A short description of your component:'
    },
    {
        type   : 'confirm',
        name   : 'typescript',
        message: 'Do you want to use typescript?'
    },
    {
        type   : 'list',
        name   : 'test',
        choices: ['jest', 'karma', 'none'],
        message: 'Which testing library do you want to use?'
    },
    {
        type   : 'confirm',
        name   : 'storybook',
        message: 'Do you want to use storybook?'
    },
    {
        name   : 'gitActions',
        type   : 'confirm',
        message: 'Do you want to use git actions?'
    }
];
const ACTIONS = [

    {
        type        : 'add',
        templateFile: './templates/{{extension}}/src/index.stories.{{extension}}x.hbs',
        path        : '{{cwd}}/{{packageName}}/src/index.stories.{{extension}}x',
        skip(ans) {
            if (!ans.storybook) {
                return 'no storybook';
            }
        }
    }, {
        type        : 'add',
        templateFile: './templates/{{extension}}/src/index.{{extension}}x.hbs',
        path        : '{{cwd}}/{{packageName}}/src/index.{{extension}}x',
        skip(ans) {
            if (!ans.storybook) {
                return 'no storybook';
            }
        }
    }, {
        type        : 'add',
        templateFile: './templates/{{extension}}/src/__tests__/index.test.{{extension}}x.hbs',
        path        : '{{cwd}}/{{packageName}}/src/__tests__/index.test.{{extension}}x',
        skip(ans) {
            if (ans.test !== 'jest') {
                return 'no jest';
            }
        }
    }, {
        type        : 'add',
        templateFile: './templates/{{extension}}/test/index.test.{{extension}}x.hbs',
        path        : '{{cwd}}/{{packageName}}/test/index.test.{{extension}}x',
        skip(ans) {
            if (ans.test !== 'karma') {
                return 'no karma';
            }
        }
    }, {
        type        : 'add',
        templateFile: './templates/github/workflows/nodejs.yml',
        destination : '{{cwd}}/{{packageName}}/.github/workflows/nodejs.yml',
        skip(ans) {
            if (ans.gitActions) {
                return 'no github actions'
            }
        }
    }, {
        type        : 'add',
        templateFile: './templates/package.json.hbs',
        path        : '{{cwd}}/{{packageName}}/package.json',
        transform(content, data) {
            const json                        = JSON.parse(content);
            const devDependencies             = json.devDependencies || (json.devDependencies = {});
            const mrbuilder                   = json.mrbuilder || (json.mrbuilder = {});
            const scripts                     = json.scripts || (json.scripts = {});
            devDependencies['@mrbuilder/cli'] = versionOnly('cli');
            if (data.test != 'none') {

                devDependencies['@mrbuilder/preset-test'] = versionOnly('preset-test');
                devDependencies[`@mrbuilder/plugin-${data.test}`] = versionOnly(`plugin-${data.test}`);
                if (!mrbuilder.env) {
                    mrbuilder.env = {};
                }
                if (!mrbuilder.env.test) {
                    mrbuilder.env.test = {};
                }
                if (!mrbuilder.env.test.plugins) {
                    mrbuilder.env.test.plugins = [];
                }
                if (!mrbuilder.env.test.presets) {
                    mrbuilder.env.test.presets = [];
                }
                mrbuilder.env.test.plugins.push(`@mrbuilder/plugin-${data.test}`);
                mrbuilder.env.test.presets.push(`@mrbuilder/preset-test`);
                if (data.test === 'karma') {
                    scripts.karma = 'mrbuilder';
                }
                scripts.test = 'mrbuilder';
            }
            if (data.typescript) {
                devDependencies['@mrbuilder/plugin-typescript'] = versionOnly('plugin-typescript');
                devDependencies['@types/enzyme']                = '^3.0.0';
                devDependencies['@types/chai']                  = '^4.0.0';
                devDependencies['@types/jest']                  = '^26.0.0';

                (mrbuilder.plugins || (mrbuilder.plugins = [])).push('@mrbuilder/plugin-typescript');
                json.types = 'src';
            }
            if (data.storybook) {
                scripts.storybook                              = 'mrbuilder';
                scripts['storybook:start']                     = 'mrbuilder';
                devDependencies['@mrbuilder/plugin-storybook'] = versionOnly('plugin-storybook');
            }
            devDependencies['@mrbuilder/preset-app'] = versionOnly('preset-app');
            devDependencies['@mrbuilder/preset-lib'] = versionOnly('preset-lib');

            return JSON.stringify(json, null, 2);
        }
    }, {
        type        : 'add',
        templateFile: './templates/.gitignore.hbs',
        path        : '{{cwd}}/{{packageName}}/.gitignore'
    }, {
        type        : 'add',
        templateFile: './templates/Readme.md.hbs',
        path        : '{{cwd}}/{{packageName}}/Readme.md'
    }, {
        type        : 'add',
        templateFile: './templates/index.js.hbs',
        path        : '{{cwd}}/{{packageName}}/index.js'
    },
    {
        type        : 'add',
        templateFile: './templates/{{extension}}/public/index.{{extension}}.hbs',
        path        : '{{cwd}}/{{packageName}}/public/index.{{extension}}'
    },
    {
        type        : 'add',
        templateFile: './templates/{{extension}}/public/App.{{extension}}x.hbs',
        path        : '{{cwd}}/{{packageName}}/public/App.{{extension}}x'
    },
    {
        type: "install",
    }
]

const printCommand = (command, description) => `${chalk.bold('$')} ${chalk.cyan(command)}\n   ${description}`;


async function install(ans) {
    await execa(process.env.npm_execpath || 'yarn', ['install'], {cwd:join(process.cwd(), ans.packageName || '')});
    return `
    ${chalk.green('Success')} creating an app.
    Inside ${ans.packageName} you can now run.
    ${chalk.bold('$')} ${chalk.cyan(`cd ${ans.packageName}`)}
    ${printCommand('yarn start', 'starts a development server')}
    ${printCommand('yarn prepare', 'compiles library')}
    ${printCommand('yarn prepare --app out', 'compiles an application in the \'out\' directory')}
    ${ans.storybook ? printCommand('yarn storybook:start', 'starts a storybook server') : ''}    
    ${ans.storybook ? printCommand('yarn storybook', 'compiles storybooks') : ''}
    ${ans.test !== 'none' ? printCommand('yarn test', `runs ${ans.test}`) : ''}
    ${ans.test === 'karma' ? printCommand('yarn karma', `runs karma in interactive mode`) : ''}    
    `
}

module.exports = (plop) => {

    plop.setHelper('cwd', process.cwd);
    plop.setHelper('versionOf', versionOf);
    plop.setHelper('versionOnly', versionOnly);
    plop.setHelper('extension', ({data: {root: {typescript}}}) => typescript ? 'ts' : 'js');
    plop.setActionType('install', install);
    plop.setGenerator('application', {
        description: 'This is sets up a mrbuilder application',
        prompts    : PROMPTS,
        actions    : ACTIONS,
    });
}
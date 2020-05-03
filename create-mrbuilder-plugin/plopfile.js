const versionOf = (val) => `"@mrbuilder/${val}": "^${require(`@mrbuilder/${val}/package.json`).version}"`;
const {exec} = require('child_process');
const destination = (d = '') => `{{cwd}}/plugins/plugin-{{name}}/${d}`;

const pexec = (cmd) => new Promise((res, rej) => exec(cmd, (e, o) => e ? rej(e) : res((o + '').trim())));
const git = async (config) => {
    try {
        return await pexec(`git config ${config}`);
    } catch (e) {
        return;
    }
}

module.exports = function (plop) {

    // create your generators here
    plop.setHelper('cwd', process.cwd);
    plop.setActionType('install', function (answers) {
        return `success\nplease run
 $ cd plugins/plugin-{{name}}  
 $ ${answers.useYarn ? 'yarn install' : 'npm install'}`;
    });
    plop.setHelper('versionOf', versionOf);
    plop.setHelper('extension', (v, ans) => ans.typescript ? 'ts' : 'js');
    plop.setHelper('name', ({data: {root: {pluginName}}}) => pluginName.replace(/.*plugin-/, ''));
    plop.setGenerator('monorepo', {
            description: 'This is sets up a mrbuilder plugin',
            prompts: [
                {
                    type: 'input',
                    name: 'pluginName',
                    message: 'what is the name of your plugin',
                },
                {
                    type: 'input',
                    name: 'namespace',
                    message: 'what namespace do you want to use?',
                    default: '@mrbuilder'
                }, {
                    type: 'input',
                    name: 'author',
                    message: 'who is the author',
                    async default() {
                        const email = await git('user.email');
                        const username = await git('user.name');
                        return `${username ? `<${username}> ${email}` : email}`
                    }
                }, {
                    type: 'input',
                    name: 'version',
                    message: 'what do you want to version it',
                    default: require('@mrbuilder/cli/package.json').version

                }, {
                    type: 'confirm',
                    name: 'babel',
                    message: 'do you want to have a babel plugin?',
                    default: 'n'
                }, {
                    type: 'confirm',
                    name: 'webpack',
                    message: 'do you want to have a webpack plugin?',
                    default: 'y'
                }, {
                    type: 'confirm',
                    name: 'cli',
                    message: 'do you want to have a cli plugin?',
                    default: 'n'
                }, {
                    type: 'confirm',
                    name: 'typescript',
                    message: 'Do you want the plugin to be in typescript',
                    default: 'n'
                }
            ], // array of inquirer prompts
            actions: [
                {
                    type: 'add',
                    template: JSON.stringify({
                        "extends": "../../tsconfig.base",
                        "compilerOptions": {
                            "rootDir": "./src",
                            "outDir": "./lib"
                        },
                        "include": [
                            "src/**/*"
                        ]
                    }),
                    path: destination('tsconfig.json'),
                    skip(answers) {
                        if (!answers.typescript) {
                            return "no typecsript";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/ts/src/types.ts',
                    path: destination('src/types.ts'),
                    skip(answers) {
                        if (!answers.typescript) {
                            return "no typescript";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/ts/src/index.ts',
                    path: destination('src/index.ts'),
                    skip(answers) {
                        if (!answers.typescript || !answers.webpack) {
                            return "no webpack";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/ts/src/babel.ts',
                    path: destination('src/babel.ts'),
                    skip(answers) {
                        if (!answers.typescript || !answers.babel) {
                            return "no babel";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/ts/src/cli.ts',
                    path: destination('src/cli.ts'),
                    skip(answers) {
                        if (!answers.typescript || !answers.cli) {
                            return "no cli";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/ts/bin/cli.js',
                    path: destination('src/cli.js'),
                    skip(answers) {
                        if (!answers.typescript || !answers.cli) {
                            return "no cli";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/js/bin/cli.js',
                    path: destination('bin/cli.js'),
                    skip(answers) {
                        if (answers.typescript || !answers.cli) {
                            return "no cli";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/js/src/index.js',
                    path: destination('src/index.js'),
                    skip(answers) {
                        if (answers.typescript || !answers.webpack) {
                            return "no cli";
                        }
                    }
                },
                {
                    type: 'add',
                    templateFile: './templates/js/src/babel.js',
                    path: destination('src/babel.js'),
                    skip(answers) {
                        if (answers.typescript || !answers.babel) {
                            return "no babel";
                        }
                    }
                },
                {
                    type: 'addMany',
                    templateFiles: './templates/*',
                    base: './templates',
                    destination: destination('')
                }, {
                    type: 'install'
                }
            ]
        }
    );
}
;

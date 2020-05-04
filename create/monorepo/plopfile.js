const versionOf = (val) => `"@mrbuilder/${val}": "${require('./package.json').devDependencies[`@mrbuilder/${val}`]}"`;

module.exports = function (plop) {
    // create your generators here
    plop.setHelper('cwd', process.cwd);
    plop.setActionType('install', function (answers) {
        return `success\nplease run
 $ cd ${answers.namespace}     
 $ ${answers.useYarn ? 'yarn install' : 'npm install -g lerna\n $ lerna init\n $ lerna bootstrap\n'}`;
    });
    plop.setHelper('versionOf', versionOf);
    plop.setGenerator('monorepo', {
        description: 'This is sets up a mrbuilder monorepo',
        prompts: [
            {
                type: 'input',
                name: 'namespace',
                message: 'what namespace do you want to use?'
            }, {
                type: 'input',
                name: 'packages',
                message: 'what directory would you like to put your packages?',
                default: 'packages'
            }, {
                type: 'input',
                name: 'version',
                message: 'what version would you like to start?',
                default: '0.0.1'
            }, {
                type: 'input',
                name: 'upstream',
                message: 'what do you call your git origin for push?',
                default: 'origin'
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

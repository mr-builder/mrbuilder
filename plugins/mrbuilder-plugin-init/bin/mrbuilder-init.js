#!/usr/bin/env node

const { camelCased }   = require('mrbuilder-utils');
const { argv }         = process;
const { join }         = require('path');
const root             = require('mrbuilder-plugin-init/package.json');
const mrbuilderVersion = root.dependencies['mrbuilder'];


const generatePackage = ({
                             name,
                             version = '0.0.1',
                             type,
                             description = '',
                             start,
                             prepublish,
                             clean,
                             test,
                             karma,
                             plugins,
                             presets,
                             repository,
                         }) => {
    if (!name) {
        throw new Error('--name is required');
    }
    switch (type) {
        case 'app': {
            prepublish = prepublish || 'mrbuilder-webpack --app app';
            start      = start || 'mrbuilder-webpack-dev-server';
            clean      = clean || 'mrbuilder-clean app';
            test       = test || 'mrbuilder-karma';
            karma      = karma || 'mrbuilder-karma';
            break;
        }
        case 'demo':
            prepublish = prepublish || 'mrbuilder-webpack --demo demo';
            start      = start || 'mrbuilder-webpack-dev-server';
            clean      = clean || 'mrbuilder-clean app';
            test       = test || 'mrbuilder-karma';
            karma      = karma || 'mrbuilder-karma';
            break;
        default:
            type       = 'lib';
            prepublish = 'mrbuilder-webpack';
            start      = start || 'mrbuilder-webpack-dev-server';
            clean      = clean || 'mrbuilder-clean';
            test       = test || 'mrbuilder-karma';
            karma      = karma || test || 'mrbuilder-karma';

    }

    const ret = {
        name,
        version,
        description,
        repository,
        devDependencies: {
            "mrbuilder": mrbuilderVersion
        },
        scripts        : {
            start,
            prepublish,
            clean,
            test,
            karma
        },
        mrbuilder      : {
            plugins,
            presets
        }
    };

    plugins && plugins.forEach(plugin => {
        if (/^mrbuilder-plugin-/.test(plugin)) {
            ret.devDependencies[plugin] = mrbuilderVersion;
        }
    });
    presets && presets.forEach(plugin => {
        if (/mrbuilder-preset-/.test(plugin)) {
            ret.devDependencies[plugin] = mrbuilderVersion;
        }
    });

    return ret;
};

const cmd = (cmd) => {
    if (!cmd) {
        return '';
    }
    return `\`\`\`sh
$ yarn run ${cmd}
\`\`\``;
};

const generateReadme = (type, {
    name,
    version,
    description,
    scripts  : {
        start,
        prepublish,
        clean,
        test,
        karma
    },
    mrbuilder: {
        plugins,
        presets
    }
}) => {
    if (!name) {
        throw new Error(`name is required`);
    }
    return `
${name}
===
${description}


## Installation    
\`\`\`sh
 $ yarn add ${name}
\`\`\`      

${(type === 'lib' || !type) ? `
## Usage
In your javascript 
\`\`\`js
import ${camelCased(name)} from "${name}";
\`\`\`
` : ''} 

## Running
${start ? `- start ${cmd('start')}` : ''}
${clean ? `- clean ${cmd('clean')}` : ''}
${test ? `- test ${cmd('test')}` : ''  }
${karma ? `- karma ${cmd('karma')}` : ''}
${prepublish ? `- build ${cmd('prepublish')}` : ''}
`
};

if (require.main === module) {

    const {
              existsSync,
              writeFileSync,
              mkdirSync
          } = require('fs');

    process.env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-plugin-init';
    const optionsManager                   = global._MRBUILDER_OPTIONS_MANAGER
                                             || (
                                                 global._MRBUILDER_OPTIONS_MANAGER =
                                                     new (require(
                                                         'mrbuilder-optionsmanager').default));
    if (argv.includes('-h', 2) || process.argv.includes('--help')) {
        console.log(optionsManager.help());
    }
    const config = optionsManager.config('mrbuilder-plugin-init');
    const {
              info = console.log,
              warn = console.warn
          }      = optionsManager.logger('mrbuilder-plugin-init');
    if (!config.name) {
        info(optionsManager.help());
        throw new Error(`must supply name`)
    }
    const dir   = join(process.cwd(), config.name);
    const mkdir = (subdir = '') => {
        if (!existsSync(join(dir, subdir))) {
            info('Making Dir', join(dir, subdir));
            mkdirSync(join(dir, subdir));
        }
    };
    const write = (file, content) => {
        file = join(dir, file);
        if (!existsSync(file)) {
            info('Creating', file);
        }
        writeFileSync(file, content, 'utf8');
    };
    mkdir();
    const _pkg = generatePackage(config);
    mkdir('src');
    mkdir('test');
    write('package.json', JSON.stringify(_pkg, null, 2));
    write('Readme.md', generateReadme(config.type, _pkg));
} else {
    module.exports = {
        generatePackage,
        generateReadme
    }
}

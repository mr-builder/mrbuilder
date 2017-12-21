#!/usr/bin/env node

const { camelCased }   = require('mrbuilder-utils');
const { argv }         = process;
const { join }         = require('path');
const root             = require(join(__dirname, '..', 'package.json'));
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
                             rootRepository,
                         }) => {
    if (!name) {
        throw new Error('--name is required');
    }
    let demo, main;
    if (rootRepository) {
        repository = `${rootRepository}/${name}`;
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
            prepublish = prepublish || 'mrbuilder-webpack';
            demo       = "mrbuilder-webpack --demo demo";
        default:
            type       = 'lib';
            main       = 'lib';
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
        "source"       : main ? "src" : void(0),
        main,
        devDependencies: {
            "mrbuilder": mrbuilderVersion
        },
        scripts        : {
            demo,
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

const generateReadme = ({ type, rootDemo }, {
    name,
    version,
    description,
    scripts  : {
        start,
        prepublish,
        clean,
        test,
        karma,
        demo
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

${rootDemo ? `A demo can be found [here](${rootDemo}/${demo}/${name})` : ''}

## Installation    
\`\`\`sh
 $ yarn add ${name}
\`\`\`      

${(type === 'lib' || !type) ? `
## Usage
In your javascript 
\`\`\`js
import ${camelCased(name, true)} from "${name}";
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
const generateIndex  = ({ name }) => {
    return `
import React, {PureComponent} from 'react';
    
export default class ${camelCased(name, true)} extends PureComponent {
   render(){
       return 'hello from ${name}'
   }
}
    
    `
};
const generateTest   = ({ name }) => {
    const Component = camelCased(name, true);
    return `
import React from 'react';
import ${Component} from '${name}';
import {expect} from 'chai';
import {mount} from 'enzyme';
    
describe('${name}',function(){
      it('should render', function(){
        const root = mount(<${Component}/>);
        expect(root.text()).to.eql('hello from ${name}');
      });
});
`
};
const main           = () => {
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
                                                         'mrbuilder-optionsmanager')
                                                         .default)({
                                                         prefix    : 'mrbuilder',
                                                         topPackage: root
                                                     }));
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
    write('Readme.md', generateReadme(config, _pkg));
    write('src/index.js', generateIndex(config));
    if (_pkg.scripts.test) {
        write(`test/${_pkg.name}-test.js`, generateTest(config));
    }
};
if (require.main === module) {
    main();
} else {
    module.exports = {
        main,
        generatePackage,
        generateReadme,
        generateIndex,
        generateTest,
    }
}

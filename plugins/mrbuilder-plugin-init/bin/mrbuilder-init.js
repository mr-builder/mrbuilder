#!/usr/bin/env node

const {camelCased}     = require('mrbuilder-utils');
const {argv}           = process;
const {join}           = require('path');
const {
          existsSync,
          writeFileSync,
          mkdirSync
      }                = require('fs');
const root             = require(join(__dirname, '..', 'package.json'));
const mrbuilderVersion = root.dependencies['mrbuilder'];

const PRESETS = ["mrbuilder-preset-app", "mrbuilder-preset-lib", "mrbuilder-preset-dev"];
const generateGitIgnore = ()=>{
    return `.idea
    .DS_Store
    yarn-error.log
    .DS_Store?
    ._*
    node_modules
    `
};

const generatePackage = ({
                             name,
                             version = '0.0.1',
                             type = 'lib',
                             description = '',
                             plugins = [],
                             presets = PRESETS,
                             repository,
                             rootRepository,
                         }) => {
    if (!name) {
        throw new Error('--name is required');
    }
    if (rootRepository) {
        repository = `${rootRepository}/${name}`;
    }

    const ret = {
        name,
        version,
        description,
        repository,
        source         : "src",
        main           : "lib",
        devDependencies: {
            "mrbuilder": `${mrbuilderVersion}`
        },
        scripts        : {
            demo      : "mrbuilder --app demo",
            start     : "mrbuilder",
            prepublish: "mrbuilder",
            test      : "mrbuilder",
            karma     : "mrbuilder"
        }
    };
    [].concat(plugins, presets).reduce((ret, plugin) => {
        if (plugin != null) {
            ret[plugin] = mrbuilderVersion;
        }
        return ret;
    }, ret.devDependencies);

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

const generateReadme    = ({type, rootDemo}, {
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

${description}

${rootDemo ? `A demo can be found [here](${rootDemo}/${demo}/${name})` : ''}

### Installation    
\`\`\`sh
 $ yarn add ${name}
\`\`\`      

${(type === 'lib' || !type) ? `
### Usage
In your javascript 
\`\`\`js static
import ${camelCased(name, true)} from "${name}";
\`\`\`
` : ''} 

### Running
${start ? `- start \n${cmd('start')}` : ''}
${clean ? `- clean \n${cmd('clean')}` : ''}
${test ? `- test \n${cmd('test')}` : ''  }
${karma ? `- karma \n${cmd('karma')}` : ''}
${prepublish ? `- build \n${cmd('prepublish')}` : ''}
`
};
const generateComponent = ({name}) => `
import React, {PureComponent} from 'react';
    
export default class ${camelCased(name, true)} extends PureComponent {
   render(){
       return <div>hello from ${name}</div>
   }
}
`;

const generateIndex = ({name}) => {
    const className = camelCased(name, true);
    return `
export ${className} from './${className}';
export default from './${className}';
`;
};

const generateExample = ({name}) => {
    const Component = camelCased(name, true);

    return `
   An example:
   
   \`\`\`js 
   <${Component}/>
   \`\`\`
   `;
};
const generateTest    = ({name}) => {
    const Component = camelCased(name, true);
    return `
import React        from 'react';
import ${Component} from '../src';
import {expect}     from 'chai';
import {mount}      from 'enzyme';
    
describe('${name}',function(){
      it('should render', function(){
        const root = mount(<${Component}/>);
        expect(root.text()).to.eql('hello from ${name}');
      });
});
`
};
const main            = () => {


    process.env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-plugin-init';
    const optionsManager                   = global._MRBUILDER_OPTIONS_MANAGER
        || (global._MRBUILDER_OPTIONS_MANAGER = new (require('mrbuilder-optionsmanager').default)({
            prefix    : 'mrbuilder',
            topPackage: root
        }));
    if (argv.includes('-h', 2) || process.argv.includes('--help')) {
        console.log(optionsManager.help());
    }
    const config                                    = optionsManager.config('mrbuilder-plugin-init');
    const {info = console.log, warn = console.warn} = optionsManager.logger('mrbuilder-plugin-init');
    if (!config.name) {
        warn(`must supply name`);
        return 1;
    }
    const className = camelCased(config.name, true);
    const dir       = join(process.cwd(), config.name);

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
            writeFileSync(file, content, 'utf8');
        }else{
            info('Skipping ', file, 'as it already exits.');
        }
    };
    mkdir();
    const _pkg = generatePackage(config);
    mkdir('src');
    mkdir('test');
    write('.gitignore', generateGitIgnore());
    write('package.json', JSON.stringify(_pkg, null, 2));
    write('Readme.md', generateReadme(config, _pkg));
    write('src/index.js', generateIndex(config));
    write(`src/${className}.js`, generateComponent(config));
    write(`src/${className}.md`, generateExample(config));
    if (_pkg.scripts.test) {
        write(`test/${_pkg.name}-test.js`, generateTest(config));
    }
    return 0;
};
if (require.main === module) {
    process.exit(main());
} else {
    module.exports = {
        main,
        generateExample,
        generatePackage,
        generateReadme,
        generateIndex,
        generateComponent,
        generateGitIgnore,
        generateTest,
    }
}

const lerna = require('lerna');
const path  = require('path');
const style = require("mrbuilder-plugin-react-styleguidist");

module.exports = function (options = {}, webpack, om) {
    options.styleguideComponents = {
        LogoRenderer: '~mrbuilder.wiki/src/components/LogoRenderer'
    };

    const ls = new lerna.LsCommand(null, {});
    ls.runPreparations();
    const plugins    = [], presets = [], core = [], other = [], examples = [];
    options.sections = [
        {
            name      : "Getting Started",
            "sections": [
                {
                    "name" : "Do I need a monorepo",
                    content: "./src/docs/monorepo.md"
                },
                {
                    "name" : "Multi Module Project",
                    content: "./src/docs/getting-started.md"
                },
                {
                    name     : "Configuration",
                    "content": "./src/docs/configuration.md"
                },
                {
                    name     : "Plugins and Presets",
                    "content": "./src/docs/plugins_and_presets.md"
                },
                {
                    name     : "Tools",
                    "content": "./src/docs/tools.md"
                }
            ]
        },

        {
            name    : "Plugins",
            sections: plugins
        },
        {
            name    : "Presets",
            sections: presets
        },
        {
            name    : 'Examples',
            sections: examples,
        },
        {
            name    : 'Other',
            sections: other
        },
        {
            name    : "Core",
            sections: core
        }
    ];
    const obj        = { core, plugins, presets, other, examples };
    ls.filteredPackages.forEach(p => {

        const { location, _package: pkg, description = '' } = p;

        const category = path.basename(path.dirname(location));
        const place    = obj[category] || obj.other;

        const conf = {
            name       : pkg.name,
            content    : path.join(location, 'Readme.md'),
            description: `
${description}  

### Installation
    
\`\`\`sh
$ yarn add ${pkg.name} -D   
\`\`\`            
${category === 'plugins' ? ` 
### Basic Configuration
In your 'package.json'

\`\`\`json
{
 "name":"your_component"
 ...
 "mrbuilder":{
    "plugins":[
      "${pkg.name}"
    ]

 }
}
\`\`\`

` : ''}          
            
`,

            //  components: pkg.name
        };


        place.push(conf);

    });
    webpack.node || (webpack.node = {});
    webpack.node.fs = 'empty';
    return style(options, webpack, om);
};

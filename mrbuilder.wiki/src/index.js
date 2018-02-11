const lerna = require('lerna');
const path  = require('path');
const style = require("mrbuilder-plugin-react-styleguidist");

module.exports = function (options = {}, webpack) {
    const ls = new lerna.LsCommand(null, {});
    ls.runPreparations();
    const plugins    = [], presets = [], core = [], other = [], examples = [];
    options.sections = [
        {
            name    : "Core",
            sections: core
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
        }
    ];
    const obj        = { core, plugins, presets, other, examples };
    ls.filteredPackages.forEach(p => {

        const { location, _package: pkg, description='' } = p;

        const category = path.basename(path.dirname(location));
        const place    = obj[category] || obj.other;

        place.push({
            name   : pkg.name,
            content: path.join(location, 'Readme.md'),

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

`:''}          
            
`,

            //  components: pkg.name
        })

    });
    webpack.node || (webpack.node = {});
    webpack.node.fs = 'empty';
    return style(options, webpack);
};

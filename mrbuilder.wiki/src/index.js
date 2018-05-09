const lerna = require('lerna');
const path  = require('path');
const style = require("mrbuilder-plugin-react-styleguidist");

module.exports = function (options = {}, webpack, om) {
    options.styleguideComponents = {
        LogoRenderer: '~mrbuilder.wiki/src/components/LogoRenderer'
    };
    options.styles = {
        StyleGuide: {
            sidebar: {
                width: '18em'
            },
            hasSidebar:{
                paddingLeft:'18em'
            }
        }
    };
    const ls = new lerna.LsCommand(null, {});
    ls.runPreparations();
    const plugins    = [], presets = [], core = [], other = [], example = [];
    options.sections = [
        {
            name      : "Getting Started",
            "sections": [
                {
                    "name" : "Overview",
                    content: "./src/docs/overview.md"
                },
                {
                    "name" : "Do I need a monorepo",
                    content: "./src/docs/monorepo.md"
                },
                {
                    "name" : "Upgrading to 3.0",
                    content: "./src/docs/upgrade-2-3.md"
                },
                {
                    "name" : "Upgrading to 2.0",
                    content: "./src/docs/upgrade-1-2.md"
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
                },
                {
                    name   : "Debugging",
                    content: "./src/docs/debugging.md"
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
            sections: example,
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
    const obj        = { core, plugins, presets, other, example };
    ls.filteredPackages.forEach(p => {

        const { location, _package: pkg, description = '' } = p;

        const category = path.basename(path.dirname(location));
        const place    = obj[category] || obj.other;

        const conf = {
            name   : pkg.name.replace(/mrbuilder-(?:plugin|preset|example)-(.*)$/,'$1'),
            content: path.join(location, 'Readme.md'),
            description,
        };
        if (category === 'plugins' || category === 'presets') {
            conf.description += `
### Installation
    
\`\`\`sh
$ yarn add ${pkg.name} -D   
\`\`\`            

### Basic Configuration
In your \`package.json\`

\`\`\`json
{
 "name":"your_component"
 "mrbuilder":{
    "${category}":[
      "${pkg.name}"
    ]
 }
}
\`\`\`

`;
        }

        if (category === 'example' || category == 'component' || category === 'presets') {
            conf.description += `
### Configuration
This is the configuration

\`\`\`json
{
"name":"${pkg.name}",
...
"mrbuilder":${JSON.stringify(pkg.mrbuilder || {}, null, 2)}
}
\`\`\`            
`
        }
        if (category == 'components'){
            conf.components = [pkg.name]
        }
        place.push(conf);

    });
    webpack.node || (webpack.node = {});
    webpack.node.fs = 'empty';
    return style(options, webpack, om);
};

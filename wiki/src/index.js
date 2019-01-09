const styleguide = require('@mrbuilder/plugin-react-styleguidist');

const first = (r) => r && r[1];
const quote = (lang, content) => `
\`\`\`${lang}
${content.trim()}    
\`\`\`
`;

module.exports = (options, webpack, om) => {

    options.description = (pkg) => {
        const category  = first(/.*(preset|plugin|core|example)[/-].*/.exec(pkg.name));
        let description = pkg.description || '';

        const src = pkg.homepage || category ? `https://github.com/mr-builder/${category}s/${pkg.name}` : `https://github.com/mr-builder/${pkg.name}`;
        if (category === 'example') {
            return `
---
${description}         
   
### Installation
${quote('sh', `
$ git clone git@github.com:mr-builder/mrbuilder.git
$ cd example/${pkg.name}
$ yarn install
`)}
           
To start the examples:

${quote('sh', `
  $ yarn start
`)}`;
        }

        description = `${description}
---

  *v${pkg.version}* [Source](${src})

### Installation
${quote('sh', `
$ yarn add ${pkg.name} -D   
`)}`;


        if (category === 'preset' || category === 'plugin') {
            description = `
---            
${description}

### Basic Configuration
In your \`package.json\`

${quote('json', `
{
 "name":"your_component"
 "mrbuilder":{
    "${category}s":[
      "${pkg.name}"
    ]
 }
}
`)}`;
        }

        if (category == 'component' || category === 'presets') {
            description = `
${description}
            
### Configuration
This is the configuration

${quote('json', `
{
"name":"${pkg.name}",
...
"mrbuilder":${JSON.stringify(p.mrbuilder || {}, null, 2)}
}
`)}`
        }

        return description;
    };
    return styleguide(options, webpack, om);
};

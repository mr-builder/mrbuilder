    const styleguide = require('mrbuilder-plugin-react-styleguidist');

const first = (r) => r && r[1];

module.exports = (options, webpack, om) => {

    options.description = (pkg) => {
        const category  = first(/.*(-preset|-plugin|-core|example)-.*/.exec(pkg.name));
        let description = pkg.description || '';

            const src   = pkg.homepage || category ? `https://github.com/mr-builder/${category}s/${pkg.name}` : `https://github.com/mr-builder/${pkg.name}`;
            description = `${description}

  *v${pkg.version}* [Source](${src})

### Installation
\`\`\`sh\n
$ yarn add ${pkg.name} -D   
\`\`\``;


        if (category === 'preset' || category === 'plugin') {
            description = `
${description}

### Basic Configuration
In your \`package.json\`

\`\`\`json
{
 "name":"your_component"
 "mrbuilder":{
    "${category}s":[
      "${pkg.name}"
    ]
 }
}
\`\`\`

`;
        }

        if ( category == 'component' || category === 'presets') {
            description = `
${description}
            
### Configuration
This is the configuration

\`\`\`json
{
"name":"${pkg.name}",
...
"mrbuilder":${JSON.stringify(p.mrbuilder || {}, null, 2)}
}
\`\`\`            
`
        }

        if (category ==='example'){
            description = `
${description}
            
To start the examples:

\`\`\`sh
  $ yarn start
\`\`\`          
`
        }
        return description;
    };
    return styleguide(options, webpack, om);
};
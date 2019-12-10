module.exports = (parameters) => {
    let imports = `import { addDecorator,addParameters } from '@storybook/react';
    import { withKnobs } from '@storybook/addon-knobs';
    `;


     if (parameters.themePkg || parameters.theme) {
         imports += `import {themes as __THEME__} from '${parameters.themePkg || '@storybook/theming'}';
         `
     }

    let code = `
    const parameters = ${JSON.stringify(parameters, null, 2)};
    `;

    if (parameters.theme) {
        code += `
            if (!parameters.options){
                parameters.options = {};
            }
            parameters.options.theme = __THEME__[${JSON.stringify(parameters.theme)}]
        `
    }

    return {
        code: `
        ${imports}
        ${code}
        addDecorator(withKnobs);
        addParameters(parameters);
        `
    };
}

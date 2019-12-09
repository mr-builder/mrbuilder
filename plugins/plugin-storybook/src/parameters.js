
module.exports = (parameters) => {
    const code = `
    import { addDecorator,addParameters } from '@storybook/react';
    import { withKnobs } from '@storybook/addon-knobs';

    addDecorator(withKnobs);
    addParameters(${JSON.stringify(parameters, null, 2)})
    `;
    return {
        code
    };
}

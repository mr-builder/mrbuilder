const { expect } = require('chai');
const mod        = require('../src');
const fakeOptionsManager = require('@mrbuilder/optionsmanager/src/MockOptionsManager');

describe('@mrbuilder/plugin-less', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const om = fakeOptionsManager(['@mrbuilder/plugin-less', '@mrbuilder/plugin-css', '@mrbuilder/plugin-babel']);
        mod.call({}, { modules: true, test:/\.less/ }, webpack,om);
        expect(webpack.module.rules,'rules').to.have.length(3);
        expect(webpack.plugins, 'plugins').to.have.length(0);
        expect(webpack.module.rules[0].use, 'rules[0].use').to.have.length(3);
    });
});

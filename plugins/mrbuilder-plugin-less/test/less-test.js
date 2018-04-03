const { expect } = require('chai');
const mod        = require('../src');
const fakeOptionsManager = require('mrbuilder-optionsmanager/src/MockOptionsManager');

describe('mrbuilder-plugin-less', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const om = fakeOptionsManager(['mrbuilder-plugin-less', 'mrbuilder-plugin-css', 'mrbuilder-plugin-babel']);
        mod.call({}, { modules: true }, webpack,om);
        expect(webpack.module.rules).to.have.length(2);
        expect(webpack.plugins).to.have.length(1);
        expect(webpack.module.rules[0].use).to.have.length(3);
    });
});

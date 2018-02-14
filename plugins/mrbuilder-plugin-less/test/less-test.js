const { expect } = require('chai');
const mod        = require('../src');

describe('mrbuilder-plugin-less', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        mod.call({}, { modules: true }, webpack);
        expect(webpack.module.rules).to.have.length(2);
        expect(webpack.plugins).to.have.length(1);
        expect(webpack.module.rules[0].use).to.have.length(3);
    });
});

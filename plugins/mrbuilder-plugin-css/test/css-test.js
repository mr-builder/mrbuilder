const mod        = require('../src');
const { expect } = require('chai');

describe('mrbuilder-plugin-css', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const ctx = {};
        mod.call(ctx, {}, webpack);

        expect(webpack.module.rules).to.have.length(1);

    });
    it('should load with modules', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const ctx = {};
        mod.call(ctx, {modules:true}, webpack);

        expect(webpack.module.rules).to.have.length(2);

    })
});

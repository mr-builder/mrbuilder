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
        expect(ctx.useStyle).to.be.exist;
    })
});

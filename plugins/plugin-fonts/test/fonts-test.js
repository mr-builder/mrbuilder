const m          = require('../src');
const { expect } = require('chai')
describe('@mrbuilder/plugin-fonts', function () {
    it('should add rules', function () {
        const webpack = {
            module: {
                rules: []
            }
        };
        m({}, webpack);
        expect(webpack.module.rules).to.have.length(4);
    });
});

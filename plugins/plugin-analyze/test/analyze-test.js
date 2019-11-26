const {expect} = require('chai');
const plugin = require('../src');
describe('@mrbuilder/plugin-analyze', function () {
    it('should register', function () {
        const options = {}, webpack = {plugins: []};
        plugin(options, webpack);
        expect(webpack.plugins).to.have.length(1);
    });
});

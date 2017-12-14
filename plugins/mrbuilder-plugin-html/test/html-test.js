const mod        = require('../src');
const { expect } = require('chai');
describe('mrbuilder-plugin-html', function () {

    it('should init', function () {
        const webpack = {
            plugins: []
        };
        mod.call({}, { title: 'whatever', entry: { 'index': 'index.js', other: 'other' } }, webpack);
        expect(webpack.plugins).to.have.length(2);

    });

    it('should entry string', function () {
        const webpack = {
            plugins: [],
            entry  : 'index.js'
        };
        mod.call({}, { title: 'whatever' }, webpack);
        expect(webpack.plugins).to.have.length(1);
    })
})
;

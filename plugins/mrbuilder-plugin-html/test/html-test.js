const mod        = require('../src');
const { expect } = require('chai');
const path       = require('path');
describe('mrbuilder-plugin-html', function () {

    it('should init', function () {
        const webpack = {
            plugins: [],
            module:{
                rules:[]
            },
        };
        mod.call({useHtml:true}, {
            title: 'whatever',
            entry: { 'index': 'index.js', other: 'other' }
        }, webpack);
        expect(webpack.plugins).to.have.length(2);


    });

    it('should entry string', function () {
        const webpack = {
            plugins   : [],
            module:{
                rules:[]
            },
            publicPath: 'public/'
        };
        mod.call({useHtml:true}, { title: 'whatever' }, webpack);
        expect(webpack.plugins).to.have.length(1);
        expect(path.relative(__dirname,  webpack.entry)).to.eql('../src/app.js');
    })
})
;

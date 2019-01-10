const mod        = require('../src');
const { expect } = require('chai');
const path       = require('path');
const fakeOptionsManager = require('@mrbuilder/optionsmanager/src/MockOptionsManager');

describe('@mrbuilder/plugin-html', function () {

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
        }, webpack, fakeOptionsManager(['@mrbuilder/plugin-css','@mrbuilder/plugin-html','@mrbuilder/plugin-webpack']));
        expect(webpack.plugins).to.have.length(2);


    });


})
;

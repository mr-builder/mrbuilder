const mod        = require('../src/');
const { expect } = require('chai');
const Mock = require('mrbuilder-optionsmanager/src/MockOptionsManager');
describe('mrbuilder-plugin-karma', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            resolve: {
                alias: {}
            }
        };

        mod.call({info(){}, warn(){}}, {}, webpack, new Mock());

        expect(webpack.plugins).to.have.length(1);
        expect(webpack.node).to.eql({
            "console": false,
            "fs"     : "empty",
            "net"    : "empty",
            "util": true
        });
        expect(webpack.devtool).to.eql('inline-source-map');
        expect(webpack.entry.test).to.exist;

    })
});

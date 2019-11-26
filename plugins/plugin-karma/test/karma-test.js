const mod = require('../src/');
const {expect} = require('chai');
const Mock = require('@mrbuilder/optionsmanager/src/MockOptionsManager');
const pkg = require('../package');
describe('@mrbuilder/plugin-karma', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            resolve: {
                alias: {}
            }
        };

        mod.call({
            info() {
            }, warn() {
            }
        }, pkg.mrbuilder.options, webpack, new Mock());

        expect(webpack.plugins).to.have.length(2);
        expect(webpack.node).to.eql({
            "console": false,
            "fs": "empty",
            "net": "empty",
            "util": true
        });
        expect(webpack.devtool).to.eql('inline-source-map');
        expect(webpack.entry).to.eql(void (0));

    })
});

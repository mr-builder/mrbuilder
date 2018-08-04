const {expect}           = require('chai');
const fakeOptionsManager = require(
    'mrbuilder-optionsmanager/src/MockOptionsManager');

describe('mrbuilder-plugin-css', function () {
    it('should load', function () {

        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const ctx     = {};
        const FAKE    = global._MRBUILDER_OPTIONS_MANAGER =            fakeOptionsManager([
                ['mrbuilder-plugin-babel', {}],
                ['mrbuilder-plugin-css', {css: false}]
            ]);
        const mod = require('../src');

        mod.call(ctx, {css:false}, webpack, FAKE);

        expect(webpack.module.rules).to.have.length(1);

    });
    it('should load with modules', function () {
        const webpack = {
            plugins: [],
            module : {
                rules: []
            }
        };
        const FAKE    = global._MRBUILDER_OPTIONS_MANAGER =
            fakeOptionsManager(['mrbuilder-plugin-babel',
                'mrbuilder-plugin-css'
            ]);
        const ctx = {};
        const mod = require('../src');

        mod.call(ctx, {modules: true}, webpack, FAKE);

        expect(webpack.module.rules).to.have.length(2);

    })
});

const options    = require('../src/');
const { expect } = require('chai');

describe('mrbuilder.wiki', function () {
    it('should not fail', function () {
        const ret = options({}, {plugins:[], resolve:{alias:{}}});
        expect(ret).to.not.be.null;

    })

});

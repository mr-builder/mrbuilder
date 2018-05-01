const fs                 = require('fs');
const { expect }         = require('chai');
const path               = require('path');
const MockOptionsManager = require(
    'mrbuilder-optionsmanager/src/MockOptionsManager');

describe('mrbuilder-plugin-clean', function () {

    it('should throw an error no optionsmanager', function () {
        let fail = false;
        try {
            require('../bin/cli');
            fail = true;
        } catch (e) {
            expect(fail).to.eql(false);
        }
    });

    it('should throw an error not enabled', function () {
        global._MRBUILDER_OPTIONS_MANAGER = new MockOptionsManager([]);
        let fail                          = false;
        try {
            require('../bin/cli');
            fail = true;
        } catch (e) {
            expect(fail).to.eql(false);
        }
    });

    it.only('should not run because disabled', function (done) {
        const tmpFile = path.join(__dirname, 'tmp');

        fs.writeFileSync(tmpFile, 'hello');
        global._MRBUILDER_OPTIONS_MANAGER =
            new MockOptionsManager([['mrbuilder-plugin-clean', {
                paths: [tmpFile]
            }]]);
        require('../bin/cli');
        setTimeout(() => {
            expect(fs.existsSync(tmpFile)).to.eql(false);
            done();
        }, 200);
    })

});

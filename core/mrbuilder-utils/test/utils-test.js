const { parseValue } = require('../src/index');
const { expect }     = require('chai');
describe('mrbuilder-utils', function () {
    it('should parse', function () {
        expect(parseValue(",mrbuilder")).to.eql(',mrbuilder');
        expect(parseValue("[mrbuilder]")).to.eql(["mrbuilder"]);
        expect(parseValue("[a,b]")).to.eql(["a", "b"]);
        expect(parseValue('["a","b"]')).to.eql(["a", "b"]);
        expect(parseValue('["a"]')).to.eql(["a"]);
        expect(parseValue('[1]')).to.eql([1]);
        expect(parseValue('[1,2]')).to.eql([1, 2]);
        expect(parseValue('[]')).to.eql([]);
        expect(parseValue('1.23')).to.eql(1.23);
        expect(parseValue('{"a":1}')).to.eql({ a: 1 })
        const re = parseValue('/a/g');
        expect(re).to.be.instanceof(RegExp);
        expect(re+'').to.eql('/a/g');

    })
});

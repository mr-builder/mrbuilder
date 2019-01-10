const {parseValue, camelToHyphen, set} = require('../src/index');
const {expect}                         = require('chai');
describe('@mrbuilder/utils', function () {
    describe('parseValue', function () {
        it('should parse', function () {
            expect(parseValue("[mrbuilder]")).to.eql(["mrbuilder"]);
            expect(parseValue("[a,b]")).to.eql(["a", "b"]);
            expect(parseValue('["a","b"]')).to.eql(["a", "b"]);
            expect(parseValue('["a"]')).to.eql(["a"]);
            expect(parseValue('[1]')).to.eql([1]);
            expect(parseValue('[1,2]')).to.eql([1, 2]);
            expect(parseValue('[]')).to.eql([]);
            expect(parseValue('1.23')).to.eql(1.23);
            expect(parseValue('{"a":1}')).to.eql({a: 1})
            expect(parseValue('true')).to.eql(true);
            expect(parseValue('false')).to.eql(false);
            expect(parseValue('{a:1,}')).to.eql({a: 1});
            // TODO - get this to pass.
            //  expect(parseValue('[{a:1,b:1}]')).to.eql([{ a: 1,b:1 }]);

            const re = parseValue('/a/g');
            expect(re).to.be.instanceof(RegExp);
            expect(re + '').to.eql('/a/g');

        });
    });
    describe('camelToHyphen', function () {
        it('should convert camelToHyphen', function () {
            expect(camelToHyphen('h')).to.eql('h');
            expect(camelToHyphen('hT')).to.eql('h-t');
            expect(camelToHyphen('helloWorld')).to.eql('hello-world');
            expect(camelToHyphen('HelloWorld')).to.eql('hello-world');
            expect(camelToHyphen('whatever0Stuff')).to.eql('whatever0-stuff');
        });
    });

    describe('set', function () {

        it('should set a value', function () {
            const v = {};
            set(v, 'stuff', 1);
            expect({stuff: 1});
        });

        it('should set a nested value', function () {
            const v = {};
            set(v, 'stuff.what', 1);
            expect({stuff: {what: 1}});
        });
        it('should return false when given false', function(){
           expect(set(false, '', true)).to.eql(false);
        });

    })
});

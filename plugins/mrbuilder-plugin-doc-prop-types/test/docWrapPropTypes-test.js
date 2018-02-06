let PropTypes    = require('../src/docWrapPropTypes');
const { expect } = require('chai');
const toJSON     = (v, pretty) => JSON.parse(JSON.stringify(v, null, pretty));
const eqJSON     = (v, expected) => {
    try {
        expect(toJSON(v)).to.eql(expected);
    } catch (e) {
        console.log(JSON.stringify(v, null, 2));
        throw e;
    }
    PropTypes.checkPropTypes(v, expected, 'prop', 'MyComponent');

};

describe("PropTypeDocs", function () {

    it('should wrap string',
        () => eqJSON(PropTypes.string, { type: 'string' }));

    it('should wrap string.isRequired',
        () => eqJSON(PropTypes.string.isRequired,
            { type: 'string', required: true }));

    it('should wrap shape', () => {
        eqJSON(PropTypes.shape({
                one: PropTypes.number,
                str: PropTypes.string.isRequired,
                obj: PropTypes.shape({
                    obj1      : PropTypes.element,
                    oneOf     : PropTypes.oneOf(['a', 'b']).isRequired,
                    oneOfType1: PropTypes.oneOfType(
                        [PropTypes.string, PropTypes.func])
                })
            }), {
                "value" : {
                    "obj": {
                        "value" : {
                            "obj1"      : {
                                "type": "element"
                            },
                            "oneOf"     : {
                                "value" : [
                                    "a",
                                    "b"
                                ],
                                "required": true,
                                "type": "oneOf"
                            },
                            "oneOfType1": {
                                "value"     : [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "func"
                                    }
                                ],
                                "type"    : "oneOfType"
                            }
                        },
                        "type": "shape"
                    },
                    "one": {
                        "type": "number"
                    },
                    "str": {
                        "required": true,
                        "type"    : "string"
                    }
                },
                "type": "shape"
            }
        );

    });

    it('should warn', function () {
        const myPropTypes = {
            name: PropTypes.string,
            age : PropTypes.number,
            // ... define your prop validations
        };

        const props    = {
            name: 'hello', // is valid
            age : 'world', // not valid
        };
        const oerror   = console.error;
        const captured = [];
        console.error  = (...args) => {
            captured.push(...args);
        };


        PropTypes.checkPropTypes(myPropTypes, props, 'prop',
            'MyComponent');
        console.error = oerror;
        expect(captured.length).to.eql(1);
    });


});



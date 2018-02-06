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
    it('should match ', function () {
        const { string, number, arrayOf, shape, func, bool } = PropTypes;

        const process = (v) => {
            console.log(JSON.stringify(v, null, 2));
        };

        const ret = eqJSON(process(
            {
                /**
                 * An array of tabs to render
                 */
                tabs             : arrayOf(shape({
                    action   : string,
                    label    : string,
                    icon     : string,
                    className: string,
                    count    : number,
                })),
                footer           : arrayOf(
                    shape({ help: string, action: string, icon: string })),
                children         : func,
                activeTab        : string,
                activeTabProperty: string,
                resizable        : bool,
                onTabChange      : func,
                className        : string
            },

            {
                className        : '',
                activeTabProperty: 'activeTab',
                onTabChange(tab, config) {
                },
            }), {
            "tabs"             : {
                "type"       : {
                    "name" : "arrayOf",
                    "value": {
                        "name" : "shape",
                        "value": {
                            "action"   : {
                                "name"    : "string",
                                "required": false
                            },
                            "label"    : {
                                "name"    : "string",
                                "required": false
                            },
                            "icon"     : {
                                "name"    : "string",
                                "required": false
                            },
                            "className": {
                                "name"    : "string",
                                "required": false
                            },
                            "count"    : {
                                "name"    : "number",
                                "required": false
                            }
                        }
                    }
                },
                "required"   : false,
                "description": "An array of tabs to render",
                "tags"       : {}
            },
            "footer"           : {
                "type"       : {
                    "name" : "arrayOf",
                    "value": {
                        "name" : "shape",
                        "value": {
                            "help"  : {
                                "name"    : "string",
                                "required": false
                            },
                            "action": {
                                "name"    : "string",
                                "required": false
                            },
                            "icon"  : {
                                "name"    : "string",
                                "required": false
                            }
                        }
                    }
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "children"         : {
                "type"       : {
                    "name": "func"
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "activeTab"        : {
                "type"       : {
                    "name": "string"
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "activeTabProperty": {
                "type"        : {
                    "name": "string"
                },
                "required"    : false,
                "description" : "",
                "defaultValue": {
                    "value"   : "'activeTab'",
                    "computed": false
                },
                "tags"        : {}
            },
            "resizable"        : {
                "type"       : {
                    "name": "bool"
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "onTabChange"      : {
                "type"        : {
                    "name": "func"
                },
                "required"    : false,
                "description" : "",
                "defaultValue": {
                    "value"   : "function(tab, config) {\n}",
                    "computed": false
                },
                "tags"        : {}
            },
            "className"        : {
                "type"        : {
                    "name": "string"
                },
                "required"    : false,
                "description" : "",
                "defaultValue": {
                    "value"   : "''",
                    "computed": false
                },
                "tags"        : {}
            }
        })

    })
    /*    it.skip('should look similar', function () {
            Object.keys(require('prop-types')).forEach(function (key) {

                expect(PropTypes[key]).to.exist;
            })
        });*/

});



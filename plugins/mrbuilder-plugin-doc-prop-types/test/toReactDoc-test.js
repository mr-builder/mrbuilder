/**
 *  "tabs"             : {
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
 * @param propTypes
 * @param defaultProps
 */
const toReactDoc = require('../src/toReactDoc');
const PropTypes  = require('../src/docWrapPropTypes');
const { expect } = require('chai');
const match      = (propTypes, defaultProps, expected) => {
    if (expected == null) {
        expected     = defaultProps;
        defaultProps = {};
    }
    const processed = toReactDoc({propTypes, defaultProps});
    try {
        expect(processed).to.eql(expected)
    } catch (e) {
        console.log(JSON.stringify(processed, null, 2));
        throw e;
    }
};
describe('toReactDoc', function () {
    const { shape, string, arrayOf, number, oneOf, oneOfType, objectOf, instanceOf, } = PropTypes;
    it('should activeTabProperty', function () {

        match(
            { activeTabProperty: string },
            { activeTabProperty: "activeTab" },
            {
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
            });

    });
    it('should match', function () {
        match({
            tabs: arrayOf(shape({
                action   : string,
                label    : string,
                icon     : string,
                className: string,
                count    : number,
            }))._doc('An array of tabs to render')
        }, {
            "tabs": {
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
            }
        });

    });
    it('should match instanceOf(Date)', function () {
        match({
            instanceOf: instanceOf(Date),
        }, {
            "instanceOf": {
                "type"       : {
                    "name" : "instanceOf",
                    "value": "Date"
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            }
        });
    });
    it('should match oneOfNumber', function () {
        match({
            oneOfNumber: oneOf([1, 2, 3]),
        }, {
            "oneOfNumber": {
                "type"       : {
                    "name" : "enum",
                    "value": [
                        {
                            "value"   : "1",
                            "computed": false
                        },
                        {
                            "value"   : "2",
                            "computed": false
                        },
                        {
                            "value"   : "3",
                            "computed": false
                        }
                    ]
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
        })
    });

    it('should match optionalObjectOf', function () {
        match({ optionalObjectOf: objectOf(number) }, {
            "optionalObjectOf": {
                "type"       : {
                    "name" : "objectOf",
                    "value": {
                        "name": "number"
                    }
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            }
        });
    });
    it('should match more', function () {


        match({
            arrayOfNumber: arrayOf(number),
            arrayOfString: arrayOf(string),
            instanceOf   : instanceOf(Date),
            oneOfString  : oneOf(['a', 'b', 'c']),
            oneOfNumber  : oneOf([1, 2, 3]),

            shapeP              : shape({
                /**comment on a**/
                a: string,
                b: number,
            }),
            oneOfTypeStringShape: oneOfType([string, shape({ b: string })])
        }, {
            "arrayOfNumber"       : {
                "type"       : {
                    "name" : "arrayOf",
                    "value": {
                        "name": "number"
                    }
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "arrayOfString"       : {
                "type"       : {
                    "name" : "arrayOf",
                    "value": {
                        "name": "string"
                    }
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "instanceOf"          : {
                "type"       : {
                    "name" : "instanceOf",
                    "value": "Date"
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "oneOfString"         : {
                "type"       : {
                    "name" : "enum",
                    "value": [
                        {
                            "value"   : "'a'",
                            "computed": false
                        },
                        {
                            "value"   : "'b'",
                            "computed": false
                        },
                        {
                            "value"   : "'c'",
                            "computed": false
                        }
                    ]
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "oneOfNumber"         : {
                "type"       : {
                    "name" : "enum",
                    "value": [
                        {
                            "value"   : "1",
                            "computed": false
                        },
                        {
                            "value"   : "2",
                            "computed": false
                        },
                        {
                            "value"   : "3",
                            "computed": false
                        }
                    ]
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "shapeP"              : {
                "type"       : {
                    "name" : "shape",
                    "value": {
                        "a": {
                            "name"    : "string",
                            "required": false
                        },
                        "b": {
                            "name"    : "number",
                            "required": false
                        }
                    }
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            },
            "oneOfTypeStringShape": {
                "type"       : {
                    "name" : "union",
                    "value": [
                        {
                            "name": "string"
                        },
                        {
                            "name" : "shape",
                            "value": {
                                "b": {
                                    "name"    : "string",
                                    "required": false
                                }
                            }
                        }
                    ]
                },
                "required"   : false,
                "description": "",
                "tags"       : {}
            }
        });

    })
});

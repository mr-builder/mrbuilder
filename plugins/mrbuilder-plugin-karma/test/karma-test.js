const mod        = require('../mrbuilder-webpack.config');
const { expect } = require('chai');

describe('mrbuilder-dev-karma', function () {
    it('should load', function () {
        const webpack = {
            plugins: [],
            resolve: {
                alias: {}
            }
        };

        mod({}, webpack);
        expect(JSON.parse(JSON.stringify(webpack, null, 2))).to.eql({
            "plugins": [
                {
                    "definitions": {
                        "SUBSCHEMA_TEST_MODULE": "/Users/jspears/WebstormProjects/mrbuilder-devel/devtools/mrbuilder-dev-karma/test"
                    }
                },
                {
                    "resourceRegExp"  : "/Users/jspears/WebstormProjects/mrbuilder-devel/devtools/mrbuilder-dev-karma/test",
                    "newContentRegExp": {}
                }
            ],
            "resolve": {
                "alias": {
                    "test": "/Users/jspears/WebstormProjects/mrbuilder-devel/devtools/mrbuilder-dev-karma/test"
                }
            },
            "devtool": "inline-source-map",
            "target" : "web",
            "node"   : {
                "fs"     : "empty",
                "net"    : "empty",
                "console": false,
                "util"   : true
            },
            "output" : {
                "pathinfo": true
            },
            "entry"  : {
                "test": "/Users/jspears/WebstormProjects/mrbuilder-devel/devtools/mrbuilder-dev-karma/test-babel-config.js"
            }
        });
        expect(webpack.plugins).to.have.length(2);


    })
});

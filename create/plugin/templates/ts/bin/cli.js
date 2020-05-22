#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS=`{{namespace}}/plugin-{{name}},${process.env.MRBUILDER_INTERNAL_PLUGINS || ''}`;
require('{{namespace}}/plugin-{{name}}/lib/cli.js');
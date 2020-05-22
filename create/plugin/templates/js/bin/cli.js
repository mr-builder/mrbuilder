#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS=`{{namespace}}/plugin-{{name}},${process.env.MRBUILDER_INTERNAL_PLUGINS || ''}`;
//require('path/to/executable');

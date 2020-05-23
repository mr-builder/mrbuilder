#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS=`{{pkg-name}},${process.env.MRBUILDER_INTERNAL_PLUGINS || ''}`;
//require('path/to/executable');

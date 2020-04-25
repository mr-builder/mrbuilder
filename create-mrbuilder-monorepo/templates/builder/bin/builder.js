#!/usr/bin/env node
process.env.MRBUILDER_PRESETS=`${__dirname}/../`
require('@mrbuilder/cli/bin/mrbuilder');

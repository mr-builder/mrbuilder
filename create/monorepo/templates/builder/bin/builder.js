#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PRESETS=`{{namespace}}/builder`
require('@mrbuilder/cli/bin/mrbuilder');

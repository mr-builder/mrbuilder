#!/usr/bin/env node
process.env.MRBUILDER_PRESETS='@{{namespace}}/builder'
require('@mrbuilder/cli/bin/mrbuilder');

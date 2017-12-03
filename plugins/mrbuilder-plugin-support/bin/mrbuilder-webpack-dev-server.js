#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = 'mrbuilder-support';
require('mrbuilder-webpack-dev-server/bin/mrbuilder-webpack-dev-server');

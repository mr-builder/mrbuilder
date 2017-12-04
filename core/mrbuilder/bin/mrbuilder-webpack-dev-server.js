#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = [process.env.MRBUILDER_INTERNAL_PLUGINS,'mrbuilder'].join(',');
require('mrbuilder-plugin-webpack-dev-server/bin/mrbuilder-webpack-dev-server');

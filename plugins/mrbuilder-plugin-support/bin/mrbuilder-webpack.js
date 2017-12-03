#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS =[process.env.MRBUILDER_INTERNAL_PLUGINS, 'mrbuilder-support'].join(',');
require('mrbuilder-webpack/bin/mrbuilder-webpack');

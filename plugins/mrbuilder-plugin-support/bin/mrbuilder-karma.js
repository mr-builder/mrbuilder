#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS =[process.env.MRBUILDER_INTERNAL_PLUGINS, 'mrbuilder-plugin-support'].join(',');
require('mrbuidler-plugin-karma/bin/mrbuilder-karma');

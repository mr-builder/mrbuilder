#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS =[process.env.MRBUILDER_INTERNAL_PLUGINS, 'mrbuilder-support'].join(',');
require('mrbuidler-karma/bin/mrbuilder-karma');

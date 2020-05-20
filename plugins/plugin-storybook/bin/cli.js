#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS = `${process.env.MRBUILDER_INTERNAL_PLUGINS || ''},@mrbuilder/plugin-storybook,@mrbuilder/cli`;
require('../src/server');

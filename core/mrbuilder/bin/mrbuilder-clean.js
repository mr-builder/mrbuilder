#!/usr/bin/env node
if (require('in-publish').inInstall()) {
    process.exit(0);
}

require('mrbuilder-plugin-babel/bin/clean-cli');

#!/usr/bin/env node
const {argv} = process;
if (!(argv.includes('-C', 2) || argv.includes('--config', 2))) {
    argv.push('--config', `${__dirname}/../src/tailwind.config.js`);
}
require('tailwindcss/lib/cli');

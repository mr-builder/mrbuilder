#!/usr/bin/env node
process.env.MRBUILDER_INTERNAL_PLUGINS=`@mrbuilder/plugin-karma,${process.env.MRBUILDER_INTERNAL_PLUGINS || ''}`
const path = require('path');
const {env, argv, cwd} = process;

if (!env.NODE_ENV) {
    env.NODE_ENV = 'test';
}

const {
    MRBUILDER_COVERAGE,
    MRBUILDER_COVERAGE_DIR,
    MRBUILDER_COVERAGE_USE_GLOBAL,
    npm_lifecycle_event,
} = env;


function indexOfArg(...find) {
    const args = argv.slice(2);
    for (let i = 0, l = find.length; i < l; i++) {
        const idx = args.indexOf(find[i]);
        if (idx != -1) {
            return idx;
        }
    }
    return -1;
}

const conf = path.resolve(__dirname, '..', 'karma.conf.js');
let pos;
if ((pos = indexOfArg('start', 'init', 'run', 'completion')) == -1) {
    argv.splice(2, 0, 'start', conf);
} else {
    argv.splice(pos - 1, 0, conf);
}
//only do single run if test event cycle or prepublish.
if (npm_lifecycle_event === 'test' || npm_lifecycle_event === 'prepublish') {
    if (!argv.includes('--single-run', 2)) {
        argv.push('--single-run');
    }
}
if (MRBUILDER_COVERAGE || MRBUILDER_COVERAGE_DIR
    || MRBUILDER_COVERAGE_USE_GLOBAL) {
    env.MRBUILDER_COVERAGE = 1;
    if (!argv.includes('--single-run', 2)) {
        argv.push('--single-run');
    }
    if (MRBUILDER_COVERAGE_USE_GLOBAL) {
        env.MRBUILDER_COVERAGE_DIR = path.resolve(cwd(), '..', 'coverage',
            path.basename(cwd()))
    }
}

require('@mrbuilder/plugin-webpack/webpack.config').then((webpack) => {
    //karma does not allow for async configuration.  So we do this. Not proud.
    global._MRBUILDER_WEBPACK_ = webpack;
    require('karma-cli/bin/karma');
}, (err) => {
    console.error(err);
    process.exit(1);
});

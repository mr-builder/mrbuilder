#!/usr/bin/env node
//for better yarn/npm compatibility.
if (require('in-publish').inInstall()) {
    process.exit(0);
}
const profileRe = /^(?:.*\/)?mrbuilder-(.+?)(?:\.js)?$/;
const {env, argv} = process;
const profile = env.MRBUILDER_PROFILE || ((idx) => {
        if (idx > -1) {
            if (argv[idx].includes('=')) {
                argv.splice(idx, 1);
                return argv[idx].split('=', 2).pop();
            } else {
                let arg = process.argv[idx + 1];
                argv.splice(idx, 2);
                return arg;
            }
        }
    })(argv.slice(2).findIndex(v => /^--mrbuilder-profile(=.*)?$/.test(v)))
    || (v => profileRe.test(v) ? v.replace(profileRe, '$1')
        : env['npm_lifecycle_event'])(
        argv[1]);

if (!env.MRBUILDER_INTERNAL_PLUGINS) {
    env.MRBUILDER_INTERNAL_PLUGINS = '@mrbuilder/cli';
}

function help(message) {
    console.warn(`
    ${message}
     $ MRBUILDER_PROFILE=${profile
    || 'test'} ${process.argv[0]} ${process.argv[1]}
    
     Supported profile's are

            karma       - runs karma
            test        - runs karma once
            mocha       - runs mocha
            babel       - runs babel
            app         - runs webpack in app mode
            app:start   - runs webpack-dev-server in app mode
            start:app   - alias to app:start
            demo        - runs webpack in demo mode
            demo:start  - runs webpack-dev-server in demo mode
            start:demo  - alias to demo:start
            build       - alias to prepublish
            production  - alias to prepublish
            prepublish  - runs webpack in production mode unless otherwise defined.
            start       - starts webpack-dev-server
            dev-server  - starts webpack-dev-server
            development - starts webpack-dev-server
            analyze     - starts webpack-dev-server in analyze mode           
            or
            start:{PROFILE} - starts webpack-dev-server in whatever PROFILE is specified.
            {PROFILE} - starts webpack in whatevever PROFILE is specified.
            Please either run from a scripts in package.json or set the
            MRBUILDER_PROFILE variable.
            
            For example to run tests
            $ MRBUILDER_PROFILE=test ${process.env[1]}
            
            or in package.json
            
            {
              "name":"your_package",
              ...
              "scripts":{
                 "test":"mrbuilder",
                 "karma":"mrbuilder",
                 "start":"mrbuilder",
                 "prepublish":"mrbuilder"
              }
            } 
    `);
    process.exit(1);
}


if (!profile) {
    help(`Please either run from a scripts in package.json or set the MRBUILDER_PROFILE variable`);
}

const envArray = [];

const isApp = (argv.slice(2).find(v => /--(app|demo)(=.*)?$/.test(v)));

profile.split(':').forEach(p => {
    switch (p) {
        case 'server':
        case 'webpack-dev-server':
        case 'dev-server':
        case 'start': {
            if (!env.NODE_ENV) {
                env.NODE_ENV = 'development';
            }
            envArray.push('start');
            break;
        }
        case 'build':
        case 'production':
        case 'prepublish':
        case 'prepublishOnly':case 'prepare':
            if (isApp) {
                envArray.push('app');
            } else {
                envArray.push('lib');
            }
            break;
        case 'test':
        case 'mocha':
        case 'jest':
        case 'karma': {
            if (!env.NODE_ENV) {
                env.NODE_ENV = 'test';
            }
            envArray.push(p);
            break;
        }
        case 'tsc':
            p = 'typescript';
        case 'analyze':
        case 'typescript':
        case 'babel-6':
        case 'babel-7':
        case 'babel':
        case 'clean':
        default: {
            if (!env.NODE_ENV) {
                env.NODE_ENV = 'production';
            }
            envArray.push(p);
            break;
        }
    }
});

env.MRBUILDER_ENV = [...new Set(envArray)].join(':');
const om = require('@mrbuilder/cli').default;
const script = om.config('@mrbuilder/cli.bin') || '@mrbuilder/plugin-webpack/bin/cli';
om.info(`running '${script}' MRBUILDER_ENV: '${env.MRBUILDER_ENV}' ${profile}`);
require(script);

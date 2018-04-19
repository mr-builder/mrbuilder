#!/usr/bin/env node
const { env, argv } = process;
const profile       = env.MRBUILDER_PROFILE || env['npm_lifecycle_event'];

function help(message) {
    console.warn(`
    ${message}
    ${profile}
     $ MRBUILDER_PROFILE=test ${process.env[1]}
    
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
    help(`Please either run from a scripts in package.json or set the
    MRBUILDER_PROFILE variable`);
}
let script;
switch (profile) {
    case "help":
        help('This helpful message');
    case "start:demo":
    case "demo:start": {
        if (!env.NODE_ENV) {
            env.NODE_ENV = "development";
        }
        script = "./mrbuilder-webpack-dev-server"

    }
    case "demo": {
        if (!env.NODE_ENV) {
            env.NODE_ENV = "production";
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        if (!argv.slice(2).find(v => /^--demo(=.*)?$/.test(v))) {
            argv.push('--demo', 'demo');
        }
        if (!script) {
            script = "./mrbuilder-webpack"
        }
        break;
    }
    case "start:app":
    case "app:start": {
        if (!env.NODE_ENV) {
            env.NODE_ENV = "development";
        }
        script = "./mrbuilder-webpack-dev-server"
    }
    case "app": {
        if (!env.NODE_ENV) {
            env.NODE_ENV = "production";
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        if (!argv.slice(2).find(v => /^--app(=.*)?$/.test(v))) {
            argv.push('--app', 'app');
        }
        if (!script) {
            script = "./mrbuilder-webpack"

        }
        break;
    }
    case "karma":
    case "test":
        if (!env.NODE_ENV) {
            env.NODE_ENV = 'test';
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        script = "./mrbuilder-karma";
        break;
    case "mocha":
        script = "./mrbuilder-mocha";
        break;
    case "babel":
        script = "./mrbuilder-babel";
        break;
    case "build":
    case "prepublish":
    case "production":
        if (!env.NODE_ENV) {
            env.NODE_ENV = 'production';
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        script = "./mrbuilder-webpack";
        break;
    case "analyze":
        env.MRBUILDER_INTERNAL_PLUGINS =
            `mrbuilder-plugin-analyze,${env.MRBUILDER_INTERNAL_PLUGINS || ''}`;
        script                         = "./mrbuilder-webpack";
        break;

    case "start":
    case "dev-server":

    case "development":
        script = "./mrbuilder-webpack-dev-server";
        if (!env.NODE_ENV) {
            env.NODE_ENV = 'development';
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        break;
    default:
        help(`${process.env[1]} does not understand '${profile}'`);
}
require(script);

#!/usr/bin/env node
const { env, argv } = process;
const profile       = env.MRBUILDER_PROFILE || ((idx) => {
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
                                            })(argv.findIndex(v => /^--mrbuilder-profile(=.*)?$/.test(v)))
                      || env['npm_lifecycle_event'];

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
    help(`Please either run from a scripts in package.json or set the
    MRBUILDER_PROFILE variable`);
}
let script;
switch (profile) {
    case "help":
        help('This helpful message');
    case "mocha":
        script = "./mrbuilder-mocha";
    case "karma":
    case "test":
        if (!env.NODE_ENV) {
            env.NODE_ENV = 'test';
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        if (!script) {
            script = "./mrbuilder-karma";
        }
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
            `mrbuilder-plugin-analyze,mrbuilder-webpack-dev-server,${env.MRBUILDER_INTERNAL_PLUGINS
                                                                     || ''}`;
        script                         = "./mrbuilder-webpack";
        break;

    case "server":
    case "start":
    case "dev-server":
    case "development": {
        if (!env.NODE_ENV) {
            env.NODE_ENV = 'development';
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = env.NODE_ENV;
        }
        script = './mrbuilder-webpack-dev-server';
        break;
    }
    //just for documentation.
    case "demo":
    case "demo:start":
    case "start:demo":
    case "app":
    case "app:start":
    case "start:app":
    default: {
        const parts      = profile.split(':', 2);
        const [p, start] = parts[0] === 'start' ? [parts[1], parts[0]] : parts;
        if (start === 'start') {
            if (!env.NODE_ENV) {
                env.NODE_ENV = 'development';
            }
            script = "./mrbuilder-webpack-dev-server";
        } else {
            if (!env.NODE_ENV) {
                env.NODE_ENV = 'production';
            }
            script = "./mrbuilder-webpack";
        }
        if (!env.MRBUILDER_ENV) {
            env.MRBUILDER_ENV = p || env.NODE_ENV;
        }
        if (script) {
            console.log(
                `starting mrbuilder using profile "${env.MRBUILDER_ENV}" NODE_ENV "${env.NODE_ENV}" and script "${script}"`)
        } else {
            help(`not sure what to do`);
        }
    }
}
require(script);

import {spawnSync} from 'child_process';
import path from 'path';
import {OptionsManagerType} from './types';

function findExecPath() {
    return process.env['$npm_execpath'] || process.env['npm_execpath'] || require('which')
        .sync('yarn', {nothrow: true}) || require('which')
        .sync('npm', {nothrow: true});

}

const yarnRe = /.*[/]?yarn([.]js)?$/;
const lernaRe = /lerna[/]cli([.]js)?$/;
/**
 * Tries to install a package as dev dependency.
 * @param e
 * @param pkg
 * @param isDev - set to false if it is not a dev dependency.
 */
let first = true;
export default function handleNotFoundTryInstall(this: OptionsManagerType, e: Error, pkg: string, isDev = true) {
    const warn = this.warn || console.warn;
    const info = this.info || console.log;
    if (!pkg || pkg === 'undefined') {
        warn(`package was null?`);
        throw new Error('undefined package');
    }
    if (this.topPackage?.dependencies?.[pkg] || this.topPackage?.devDependencies?.[pkg] || this.topPackage?.peerDependencies?.[pkg]) {
        warn(`'${pkg}' is already in your package.json try running install if you see this message again`);
        return;
    }

    const npmPath = findExecPath();
    if (npmPath) {
        const installPkg = `${pkg}@latest`;
        const isYarn = yarnRe.test(npmPath);
        const isLerna = isYarn ? false : lernaRe.test(npmPath);
        if (first) {
            first = false;
            info(
                `using '${npmPath}' to install '${pkg}' this might take a minute, and
                 should only happen when you haven't installed it as a dependency. After it installs
                 successfully it won't do this the next time you run mrbuilder. If you would
                 rather declare it as a ${isDev ? 'devDependency'
                    : 'dependency'} in your package.json, 
                 you can quit now and add it manually.
                 
                 Note: there may be more plugins/presets that need to be installed.  Same
                 rules apply, but you won't get the full message.
               
                `);
        } else {
            info(`using '${isYarn ? 'yarn'
                : isLerna ? 'lerna' : 'npm'}' to install '${installPkg}'.`);
        }

        const args = ['add', installPkg];

        if (isDev) {
            args.push(isLerna ? '--dev' : '-D');
        }

        const res = spawnSync(npmPath, args, {
            stdio: ['inherit', 'inherit', 'inherit'],
            env: Object.assign({}, process.env, {
                NODE_ENV: 'development',
                [`MRBUILDER_NO_AUTOINSTALL`]: 1,
            })
        });

        if (res.status === 0) {
            info(`install of '${pkg}' succeeded.`);
            //try sleeping so that things don't go loopy.
            spawnSync(process.argv[0],
                ['-e', 'setTimeout(process.exit, 1000, 0)']);

            return;
        }
        const err = res.stderr + '';
        warn(`install of '${pkg}' failed with status ${res.status}!
            
             try running

            # ${isYarn ? 'yarn' : 'npm'} ${args.join(' ')}
            
            \n ` + err);
        throw (e || err);

    } else {
        warn(
            `could not find yarn or npm to install '${pkg}' 
            Try adding a command to your package.json something like
            {
              ...
              "scripts":{
                 "${path.basename(process.env.argv[1])}":"${process.env.argv[1]}"
              }  
            }
            $ yarn run ${path.basename(process.env.argv[1])}
            
            or adding the path to yarn to PATH .
            run under package.json scripts for better results.`);
        throw e;
    }

};

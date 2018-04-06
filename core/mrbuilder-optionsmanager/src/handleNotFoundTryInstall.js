const { spawnSync } = require('child_process');
const path          = require('path');

function findExecPath() {
    return process.env['$npm_execpath'] || require('which')
        .sync('yarn', { nothrow: true }) || require('which')
               .sync('npm', { nothrow: true });

}

const yarnRe   = /.*[/]?yarn([.]js)?$/;
let mrbuilderVersion;
/**
 * Tries to install a package as dev dependency.
 * @param e
 * @param pkg
 * @param isDev - set to false if it is not a dev dependency.
 */
let first      = true;
module.exports =
    function handleNotFoundTryInstall(e, pkg, isDev = true) {
        const warn = this.warn || console.warn;
        const info = this.info || console.log;
        if (!pkg || pkg === 'undefined') {
            warn(`package was null?`);
            return;
        }

        const npmPath = findExecPath();
        if (npmPath) {
            if (!mrbuilderVersion) {
                mrbuilderVersion = require('mrbuilder/package.json').version;
            }
            const installPkg = `${pkg}@^${mrbuilderVersion}`;
            const isYarn     = yarnRe.test(npmPath);
            if (first) {
                first = false;
                info(
                    `using ${isYarn ? 'yarn' : 'npm'} to install '${pkg}' this might take a minute, and
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
                    : 'npm'}' to install '${installPkg}'.`);
            }

            const args = isYarn ? ['add', installPkg] : ['install', installPkg];

            if (isDev) {
                args.push(isYarn ? '-D' : '--save-dev');
            }

            const res = spawnSync(npmPath, args, {
                stdio: ['inherit', 'inherit', 'inherit']
            });

            if (res.status === 0) {
                info(`install of '${pkg}' succeeded.`);
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

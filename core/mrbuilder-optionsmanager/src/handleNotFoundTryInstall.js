const { spawnSync } = require('child_process');
const path = require('path');
function findExecPath() {
    return process.env['$npm_execpath'] || require('which')
        .sync('yarn', { nothrow: true }) || require('which')
               .sync('npm', { nothrow: true });

}

const yarnRe = /.*[/]?yarn([.]js)?$/;

/**
 * Tries to install a package as dev dependency.
 * @param e
 * @param pkg
 * @param isDev - set to false if it is not a dev dependency.
 */

module.exports =
    function handleNotFoundTryInstall(e, pkg, isDev = true) {
        const warn = this.warn || console.warn;
        const info = this.info || console.log;

        const npmPath = findExecPath();
        if (npmPath) {
            info(
                `using yarn '${npmPath}' to install '${pkg}' this might take a minute.`);

            const isYarn = yarnRe.test(npmPath);
            const args   = isYarn ? ['add', pkg] : ['install', pkg];

            if (isDev) {
                args.push(isYarn ? '-D' : '--save-dev');
            }

            const res = spawnSync(npmPath, args);

            if (res.status === 0) {
                info(`install of '${pkg}' succeeded.`);
                return;
            }
            const err = res.stderr + '';
            warn(`install of '${pkg}' failed!
            
             try running

            $ yarn add ${pkg} ${isDev ? '-D' : ''}

            or npm

            $ npm install ${pkg} ${isDev ? '--save-dev' : ''}
            
            
            \n ` + err);
            throw (e || err);

        } else {
            warn(
                `could not find yarn or npm to install '${pkg}' 
            Try adding a command to your package.json 
            {
              ...
              "scripts":{
                 "${path.basename(process.env.argv[1])}":"${process.env.argv[1]}"
              }  
            }
            $ yarn run mrbuilder
            
            or adding the path to yarn to PATH .
            run under package.json scripts for better results.`);
            throw e;
        }

    };

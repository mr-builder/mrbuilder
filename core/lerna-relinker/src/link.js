#!/usr/bin/env node

"use strict";

var {
    exit,
    buildLinks,
    filteredPkgs
} = require('./idea');
var fs = require('fs');
var FileSystemUtilities = require('lerna/lib/FileSystemUtilities');
var path = require('path');
var isWindows = (process.platform === 'win32');
function promise(fn, scope) {

    return function () {
        if (typeof fn == 'string') {
            fn = scope[fn];
        }
        scope = scope || this;
        const args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
            return fn.apply(scope, args.concat(function (e, o) {
                if (e) return reject(e);
                return resolve(o);
            }))
        })
    }
}
var mkdirp = promise(FileSystemUtilities.mkdirp, FileSystemUtilities);
var symlink = promise(FileSystemUtilities.symlink, FileSystemUtilities);


function realLink() {
    let LINKS = buildLinks();
    return Promise.all(Object.keys(LINKS).map(function (project) {
        const modulesPath = path.join(project, 'node_modules');
        const deps = LINKS[project];
        if (deps == null)
            return;
        let depKeys = Object.keys(deps);
        if (depKeys.length == 0)
            return;
        return mkdirp(modulesPath).then(Promise.all(depKeys.map(function (modName) {
            const newModPath = path.relative(process.cwd(), path.join(modulesPath, modName));
            const existingPath =
                  isWindows
                  ? path.resolve(process.cwd(), deps[modName])
                  : path.relative(process.cwd(), deps[modName]);
            if (!fs.existsSync(newModPath)) {
                if (fs.existsSync(existingPath)) {
                    console.log('link', newModPath, '->', existingPath);

                    return symlink(existingPath, newModPath, 'junction');
                } else {
                    console.warn(`existing project does not exist?`, existingPath);
                }
            }
        })));
    }));
}


function doLink(done) {
    console.log(JSON.stringify(buildLinks(), null, 2));

    realLink().then(function () {
        done(null, `all done`);
    }, done)
}

if (require.main === module) {
    doLink(exit);
}

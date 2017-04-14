#!/usr/bin/env node
"use strict";

/**
 * This is a hack to force exclusion of electrode-ota dependencies.
 */

var fs = require('fs'),
    xml2js = require('xml2js'),
    path = require('path'),
    LsCommand = require('lerna/lib/commands/LsCommand');
var builder = new xml2js.Builder();
var ls = new LsCommand(null, {}, process.cwd());
ls.runPreparations();
var parser = new xml2js.Parser();


var filteredPkgs = ls.filteredPackages.reduce(function (ret, pkg) {
    ret[pkg.name] = pkg;
    return ret;
}, {});

function addIfNotExists(arr, name) {
    var url = `file://$MODULE_DIR$/${name}`;
    if (arr.find(function (obj) {
            return obj.$.url === url;
        })) {
        return false;
    }
    arr.push({
        $: {
            url: url
        }
    });
    return true;
}

function isIncludedPackage(name) {
    return filteredPkgs[name];
}

function addExcludesToWorkspace(idea, done) {
    fs.readFile(idea, function (err, data) {
        if (err) return done(err);
        const links = buildLinks();
        let add = false;
        parser.parseString(data, function (err, result) {
            if (err) return done(err);
            try {
                //uses this to pass in the array to muck.
                const excludeFolders = result.module.component[0].content[0].excludeFolder;
                Object.keys(links).forEach(function (key) {
                    const deps = links[key];
                    addIfNotExists(excludeFolders, `${key}/lib`);
                    Object.keys(deps).forEach(function (depKey) {
                        add |= addIfNotExists(excludeFolders, `${key}/node_modules/${deps[depKey]}`);

                    })
                });
                if (add) return done(null, builder.buildObject(result));
                return done();
            } catch (e) {
                return done(e);
            }
        });
    });
}
function exit(e, o) {
    if (e) {
        console.trace(e);
    } else {
        console.log(o);
    }
    process.exit(0);
}
function findWorkspaceIml(done) {
    var moduleFile = path.join(process.cwd(), '.idea', 'modules.xml')
    if (fs.existsSync(moduleFile)) {
        fs.readFile(moduleFile, 'utf8', function (err, content) {
            if (err) return done(err);
            parser.parseString(content, function (err, result) {
                if (err) return done(err);
                try {
                    done(null, result.project.component[0].modules[0].module[0].$.filepath.replace('$PROJECT_DIR$', process.cwd()));
                } catch (e) {
                    done(e);
                }
            });
        });
    } else {
        done();
    }
}
function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}


function updateIntellij(done) {
    return function updateIntellij$internal(err, filename) {
        if (err || !filename) return done();
        if (fs.existsSync(filename)) {
            var backupFile = filename + '.' + Date.now()
            addExcludesToWorkspace(filename, function (err, content) {
                if (content) {
                    console.log(`Backing up ${filename} into ${backupFile}`);
                    copyFile(filename, backupFile, function (err) {
                        if (err) return done(err);
                        fs.writeFile(filename, content, 'utf8', function (err) {
                            if (err) return done(err);
                            done(null, `Updated file ignores in workspace`);
                        });
                    });
                } else {
                    done(null, `No changes made.`);
                }
            });
        } else {
            return done(new Error(`file does not exist ${filename}`));
        }
    }
}
function relative(name) {
    return path.relative(process.cwd(), name);
}
function buildLinks() {
    var LINKS = {};

    function link(from, dep, linkTo) {
        from = relative(from);
        linkTo = relative(linkTo);
        if (!LINKS[from]) {
            LINKS[from] = {};
            (LINKS[from][dep] = linkTo);
            return true;

        } else if (LINKS[from][dep]) {
            return false;
        }
        LINKS[from][dep] = linkTo;
        return true;
    }

    function filterLink(obj) {
        if (!obj) return [];
        return Object.keys(obj).map(isIncludedPackage).filter(Boolean);
    }

    function linkDepedencies(pkg, deps) {
        filterLink(deps).forEach(function (toPkg) {
            if (toPkg == pkg) {
                return;
            }
            if (link(pkg._location, toPkg.name, toPkg._location)) {
                linkDepedencies(pkg, toPkg.dependencies);
                linkDepedencies(pkg, toPkg.devDependencies);
                linkDepedencies(pkg, toPkg.peerDependencies);
            }
        });
    }

    function linkAll(key) {
        const pkg = filteredPkgs[key];
        linkDepedencies(pkg, pkg.dependencies);
        linkDepedencies(pkg, pkg.devDependencies);
        linkDepedencies(pkg, pkg.peerDependencies);

    }

    Object.keys(filteredPkgs).forEach(linkAll);
    return LINKS
}
module.exports = {
    exit,
    buildLinks
};
if (require.main === module) {
    findWorkspaceIml(updateIntellij(exit));
}

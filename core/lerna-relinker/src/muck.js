#!/usr/bin/env node
"use strict";

var _LsCommand = require('lerna/lib/commands/LsCommand');
var LsCommand = _LsCommand.default || _LsCommand;
var get = require('lodash/get');
var set = require('lodash/set');
var fs = require('fs');
var path = require('path');
function parse(value) {
    value = value.trim();
    if (value === 'true' || value === 'false') {
        return JSON.parse(value);
    }
    if (value === 'null') return null;
    if ((value.startsWith('{') && value.endsWith('}')) ||
        (value.startsWith('[') && value.endsWith(']')) ||
        (value.startsWith('"') && value.endsWith('"')) ||
        /^((?:NaN|-?(?:(?:\d+|\d*\.\d+)(?:[E|e][+|-]?\d+)?|Infinity)))$/.test(value))
        return JSON.parse(value);
    return JSON.parse(`"${value}"`)
}

function _set(json, _args) {
    if (get(json, _args[0]) === _args[1]) {
        return false;
    }
    set(json, _args[0], _args[1]);
    return true;
}

function __get(key) {
    return JSON.stringify(get(this, key));
}

function execGet(json, _keys) {
    var str = _keys.map(__get, json).join(',');
    console.log(this.name, '=', str);
    return false;
}

function _delete(json, keys) {
    if (get(json, keys[0]) === void(0)) {
        return false;
    }
    set(json, keys[0], void(0));
    return true;
}
function muck(name, args) {
    function help(msg) {
        if (msg) console.error(msg);
        console.log(`${name}   [-sdgihfe] <files>
      -s\t--set\t\tkey=value sets key to value
      -d\t--delete\ttdeletes values (comma)
      -g\t--get\t\tvalue gets the value
      -i\t--ignore\tpackages to ignore
      -h\t--help\t\tthis helpful message
      -f\t--file\t\tpackage.json default
      -e\t--extension\tuse a different extension
      --no-extension\tuse in place
    `);
        return 1;
    }

    var commands = [];
    var i = 0;
    var options = {};
    var opts = {
        extension: '.bck',
        files: []
    };


    for (var l = args.length; i < l; i++) {
        switch (args[i]) {
            case '-s':
            case '--set':
                var parts = args[++i].split('=', 2);
                commands.push([_set, [parts[0], parse(parts[1])]]);
                break;
            case '-d':
            case '--delete':
                commands.push([_delete, args[++i].split(/,\s*/)]);
                break;
            case '-g':
            case '--get':
                const getArr = args[++i].split(/,\s*/);
                console.log('getArr', args[i]);
                commands.push([execGet, getArr]);
                break;
            case '-i':
            case '--ignore':
                options['ignore'] = args[++i];
                break;
            case '-f':
            case '--file':
                opts.files = opts.files.concat(args[++i].split(/,\s*/));
                break;
            case '-e':
            case '--extension':
                opts['extension'] = args[++i];
                break;
            case '--no-extension':
                opts['extension'] = '';
            case '-h':
            case '--help':
                return help();

        }
    }
    if (commands.length == 0) {
        return help(`need a command ${args}`);
    }

    opts.files = opts.files.concat(args.slice(i));
    if (opts.files.length == 0) {
        opts.files.push('package.json');
    }

    const ls = new LsCommand(null, options, process.cwd());
    ls.runPreparations();

    ls.filteredPackages.forEach(function (pkg) {
        opts.files.forEach(function (file) {
            var fname = path.join(pkg._location, file);
            var saveMuck = false;
            var json;
            try {
                json = JSON.parse(fs.readFileSync(fname, 'utf8'));
                if (fs.existsSync(fname)) {
                    commands.forEach(function (cmd) {
                        saveMuck |= cmd[0].call(pkg, json, cmd[1]);
                    });
                }
            } catch (e) {
                saveMuck = false;
                console.trace(e);
            }
            if (saveMuck && json) {
                fs.writeFileSync(fname + opts.extension, JSON.stringify(json, null, 2), 'utf8');
            }
        })
    });
    return 0;
}
if (require.main === module) {
    process.exit(muck(process.argv[1], process.argv.slice(2)));
} else {
    module.exports = {muck: run};
}

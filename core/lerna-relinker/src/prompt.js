import LsCommand from 'lerna/lib/commands/LsCommand'
import set from 'lodash/set';
import get from 'lodash/get';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

function parse(value) {
    value = value.trim();
    if (value === 'true' || value === 'false') {
        return JSON.parse(value);
    }
    if (value === 'null') return null;
    if (value === '') return value;
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
async function muckFile(pkg, file, opts) {
    let saveMuck = false;
    const fullname = path.join(pkg._location, file);
    let json;
    try {
        json = await
            read(fullname);
    } catch (e) {
        console.warn(`Error reading ${fullname}`, e);
        return false
    }
    for (const cmd of opts.commands) {
        saveMuck |= await
            cmd[0].call(pkg, json, cmd[1], file);
    }

    if (saveMuck && json) {
        let newfile = fullname + opts.extension;
        if (!options.noExtension && fs.existsSync(newfile)) {
            console.warn(`a file named ${newfile} already exists remove it`);
            return;
        }
        try {
            await
                write(newfile, json);
        } catch (e) {
            console.warn(`Error writing ${newfile}`, e)
        }
    }
    return true;

}

async function muck(name, args) {

    async function _prompt(json, keys, filename) {
        const key = keys[0],
            self = this,
            _default = get(json, key),
            message = `Do you want to change property '${key}' in '${this.name}/${filename}'?`;

        if (opts.skipIfExists && _default != null) {
            return;
        }
        let confirm = await inquirer.prompt([{type: 'confirm', name: 'value', message, default: _default}]);

        if (confirm.value) {
            const answer = await inquirer.prompt([{
                type: 'input',
                name: 'value',
                message: `OK what would like to change it to?`
            }]);
            if (answer.value === _default) {
                return false;
            }
            try {
                return _set.call(self, json, [key, parse(answer.value)]);
            } catch (e) {
                console.log(`Could not parse the value try again`);
                return _prompt.call(this, json, keys, filename);
            }
        }
    }

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
      -p\t--prompt\tkey=question\tprompt 
      -k\t--skip-if-exists\tSkip the question if it has value
      -n\t--no-lerna\tJust use the file don't iterate of lerna projects
      --no-extension\tuse in place
    `);
        return 1;
    }

    var opts = {
        extension: '.bck',
        files: [],
        commands: [],
        options: {}
    };
    const commands = opts.commands;
    const options = opts.options;
    for (var l = args.length, i = 0; i < l; i++) {
        let [arg, val] = args[i].split('=', 2);
        switch (arg) {
            case '-k':
            case '--skip-if-exists':
                opts.skipIfExists = true;
                break;
            case '--confirm':
            case '-c':
                opts.confirm = true;
                break;
            case '--prompt':
            case '-p':
                commands.push([_prompt, (val || args[++i]).split('=', 2)]);
                break;
            case '-s':
            case '--set':
                var parts = (val || args[++i]).split('=', 2);
                commands.push([_set, [parts[0], parse(parts[1])]]);
                break;
            case '-d':
            case '--delete':
                commands.push([_delete, (val || args[++i]).split(/,\s*/)]);
                break;
            case '-g':
            case '--get':
                commands.push([execGet, (val || args[++i]).split(/,\s*/)]);
                break;
            case '-i':
            case '--ignore':
                options['ignore'] = args[++i];
                break;
            case '-f':
            case '--file':
                opts.files = opts.files.concat((val || args[++i]).split(/,\s*/));
                break;
            case '-e':
            case '--extension':
                opts['extension'] = (val || args[++i]).trim();
                if (!opts['extension']) {
                    return help(`--extension requires an extension use --no-extension to rename in place`)
                }
                break;
            case '--no-extension':
                opts.noExtension = true;
                break;
            case '-n':
            case '--no-lerna':
                opts.noLerna = true;
                break;
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
    if (!opts.noLerna) {
        const ls = new LsCommand(null, options, process.cwd());
        ls.runPreparations();
        for (const pkg of ls.filteredPackages) {
            for (const file of opts.files) {
                await
                    muckFile(pkg, file, opts);
            }
        }
    } else {
        for (const file of opts.files) {
            await  muckFile({name: '.', _location: process.cwd()}, file, opts);
        }
    }
}

function write(filename, json) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, JSON.stringify(json, null, 2), 'utf8', function (e, o) {
            if (e) return reject(e);
            resolve(o);
        });
    })
}
function read(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf8', function (e, o) {
            if (e) return reject(e);
            try {
                resolve(JSON.parse(o));
            } catch (e) {
                reject(e);
            }
        })
    })
}

if (require.main === module) {
    muck(process.argv[1], process.argv.slice(2)).then(function (res) {
        process.exit(res);
    }, function (e) {
        console.trace(e);
        process.exit(1);
    });
}

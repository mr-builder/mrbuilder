#!/usr/bin/env node
import LsCommand from 'lerna/lib/commands/LsCommand'
import set from 'lodash/set';
import has from 'lodash/has';
import get from 'lodash/get';
import unset from 'lodash/set';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const write = (filename, json) => new Promise((resolve, reject) => fs.writeFile(filename, JSON.stringify(json, null, 2), 'utf8', (e, o) => e ? reject(e) : resolve(o)));
const empty = (obj, key) => !has(obj, key);
const read = filename => new Promise((resolve, reject) => fs.readFile(filename, 'utf8', (e, o) => e ? reject(e) : resolve(JSON.parse(o))));

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


async function confirm(message, {confirm = false}) {
    if (confirm) {
        const answer = await inquirer.prompt([{message, type: 'confirm', name: 'confirm'}]);
        return answer.confirm;
    }
    return true;
}


async function _set(json, [key, value], filename, opts) {
    if (get(json, key) === value) {
        return false;
    }
    if (has(json, key) && await confirm(`Are you sure you want to change ${key} in '${filename}?'`, opts)) {
        return false;
    }
    set(json, key, value);
    return true;
}

function __get(key) {
    return JSON.stringify(get(this, key));
}

async function _move(json, keys, filename, opts) {
    const [from, to] = keys;
    if (!from || !to) {
        console.warn(`move requires an argument`, from, to);
    }
    if (has(json, from)) {
        if (!await confirm(`Are you sure you want to move '${from}' to '${to}' in '${filename}?'`, opts)) {
            return false;
        }
        const f = get(json, from);
        unset(json, from);
        //Merge objects if there is a destination
        if (typeof f === 'object' && get(json, to)) {
            for (const key of Object.keys(f)) {
                set(json, `${to}.${key}`, f[key]);
            }
        } else {
            set(json, to, f);
        }
        return true;
    }
    return false;
}

function _get(json, keys, filename, opts) {
    const str = keys.map(__get, json).join(',');
    console.log(this.name, '=', str);
    return false;
}
async function _delete(json, keys, filename, opts) {
    let ret = false;
    for (const key of keys) {
        if (has(json, key)) {
            if (!(await confirm(`Are you sure you want to delete '${key}'`, opts))) {
                continue;
            }
        }
        unset(json, key);
        ret |= true;
    }
    return ret;
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
            cmd[0].call(pkg, json, cmd[1], file, opts);
    }

    if (saveMuck && json) {
        let newfile = fullname + opts.extension;
        if (!opts.noExtension && fs.existsSync(newfile)) {
            if (!(await confirm(`a file named ${newfile} already, do want to overwrite?`, opts))) {
                return false;
            }
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
async function _prompt(json, args, filename, options) {
    const
        [key, vmessage = 'Do you want to change the property'] = args,
        self = this,
        _default = get(json, key),
        message = `${vmessage} '${key}' in '${this.name}/${filename}'?`;

    if (options.skipIfExists && _default != null) {
        return;
    }
    const change = await confirm(message, {confirm: true});

    if (change) {
        const answer = await inquirer.prompt([{
            type: 'input',
            name: 'value',
            message: `OK what would like to change it to?`
        }]);
        if (answer.value === _default) {
            return false;
        }
        try {
            set(json, key, parse(answer.value));
            return true;
        } catch (e) {
            console.warn(`Could not parse the value try again`, e);
            return _prompt.call(self, json, args, filename, options);
        }
        return false;
    }
}

function makeOptions(name, args) {
    function help(msg) {
        if (msg) console.error(msg);
        console.warn(`${name}   [-sdgihfe] <files>
      -b\t--backup\tuse a different extension
      -p\t--prompt\tkey=question\tprompt for value before changing 
      -c\t--confirm\tconfirm before dangerous operations
      -m\t--move\t\tMove property from=to
      -s\t--set\t\tkey=value sets key to value
      -d\t--delete\tdeletes values (comma)
      -g\t--get\t\tvalue gets the value
      -i\t--ignore\tpackages to ignore
      -h\t--help\t\tthis helpful message
      -f\t--file\t\tpackage.json default
      -k\t--skip-if-exists\tSkip the question if it has value
      -n\t--no-lerna\tJust use the file don't iterate over lerna projects
      --no-extension\tuse in place
    `);
        process.exit(1);
    }

    const opts = {
        extension: '.bck',
        files: [],
        commands: [],
        options: {}
    };
    const commands = opts.commands;
    const options = opts.options;
    //need this to suck up files at the end.
    let i = 0;
    for (let l = args.length; i < l; i++) {
        let [arg, val] = args[i].split('=', 2);
        switch (arg) {
            //actions
            case '--prompt':
            case '-p':
                commands.push([_prompt, (val || args[++i]).split('=', 2)]);
                break;
            case '-s':
            case '--set':
                const [key, value] = (val || args[++i]).split('=', 2);
                commands.push([_set, [key, parse(value)]]);
                break;
            case '-d':
            case '--delete':
                const keys = (val || args[++i]).split(/,\s*/);
                commands.push([_delete, keys]);
                break;
            case '-g':
            case '--get':
                commands.push([_get, (val || args[++i]).split(/,\s*/)]);
                break;
            case '-m':
            case '--move':
                commands.push([_move, (val || args[++i]).split(/\s*=\s*/, 2)]);
                break;
            //options
            case '-k':
            case '--skip-if-exists':
                opts.skipIfExists = true;
                break;
            case '--confirm':
            case '-c':
                opts.confirm = true;
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
            case '-b':
            case '--backup':
                opts['extension'] = (val || args[++i]).trim();
                if (!opts['extension']) {
                    return help(`--backup requires an extension use --no-backup to rename in place`)
                }
                break;
            case '--no-extension':
            case '--no-backup':
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
        help(`need a command ${args}`);
    }

    opts.files = opts.files.concat(args.slice(i));
    if (opts.files.length == 0) {
        opts.files.push('package.json');
    }
    return opts;
}


async function muck(opts) {


    if (!opts.noLerna) {
        const ls = new LsCommand(null, opts.options, process.cwd());
        ls.runPreparations();
        for (const pkg of ls.filteredPackages) {
            for (const file of opts.files) {
                await muckFile(pkg, file, opts);
            }
        }
    } else {
        for (const file of opts.files) {
            await  muckFile({name: '.', _location: process.cwd()}, file, opts);
        }
    }
}
if (require.main === module) {
    muck(makeOptions(process.argv[1], process.argv.slice(2))).then(function (res) {
        process.exit(res);
    }, function (e) {
        console.trace(e);
        process.exit(1);
    });
}

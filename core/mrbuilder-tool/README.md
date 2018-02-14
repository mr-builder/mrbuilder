## Muck
This a tool for mucking with json files within projects. Mostly package.json, its meant to be able to quickly create
combinations of commands for making things work.

Examples.
```sh
$ mr-muck -p name="Name the Package" -s devDependencies.stuff=1.7.0 -c -C -n config.json
```
Would create a file like this if it does not exist.  If it did it exist it would create config.json.bck and would
have name set to Somethign and a devDependency of stuff.

```json
{
  "name": "Something",
  "devDependencies": {
    "stuff": "1.7.0"
  }
}

```
And then some other time you wanted to add a description. you could
```sh
$ mr-muck -p name="Name the Package" -p description="Describe the Package" -s devDependencies.stuff=1.7.0 -s dependencies.other=1.0.0 -c -C -n config.json
```

### Options

**Path** is a dot notation path a.b.c

| Argument      | Short | Type       | Description                      |
| ------------- | ------|------------| ---------------------------------|
| --prompt      | -p    | message    | Prompt for any changes           |
| --set         | -s    | **path**=value | Set the path                     |
| --delete      | -d    | **path**   | Delete the key and value         |
| --get         | -g    | **path**   | Get the value(s) for the path    |
| --move        | -mv   | **path**=path  | Move path from location to another|
| --skip        | -k    |            | Skip if value exists             |
| --unless      | -u    |            | Only if key exists               |
| --confirm     | -c    |            | Confirm change                   |
| --ignore      | -i    | packages   | Packages to ignore               |
| --no-lerna    | -n    |            | Don't use lerna                  |
| --file        | -f    | file       | File to operate upon             |
| --create-file | -c    |            | Create file if it does not exist |
| --preview     | -P    |            | Preview files that change before writing|
| --scope       | -S    |            | Only operate on these packages   |
| --no-extension|       |            | Write in place, no backup file   |
| --help        | -h    |            | Helpful message                  |

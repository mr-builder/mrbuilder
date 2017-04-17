Lerna Relinker
==
Basically [fixes](https://github.com/lerna/lerna/issues/696) the deps of deps for [lerna](https://github.com/lerna).  It runs through your project and creates links for dependencies within
your project.

Of course you know this but...
*** Use at your own risk***


## Installation
```js
npm i lerna-relinker --save-dev
```

## Usage
You can run it directly, but your better off putting it in your npm scripts.

```js
./node_modules/.bin/lr-link

```



## Idea helpers.
If you use webstorm this will fix your setup, (prevent the infite indexing, and generally do the right excludes)

```js
./node_modules/.bin/lr-idea

```

## Muck
This a tool for mucking with json files within projects. Mostly package.json, its meant to be able to quickly create
combinations of commands for making things work.

-h gives the help

Examples.
```sh
$ lr-muck -p name="Name the Package" -s devDependencies.stuff=1.7.0 -c -C -n config.json 
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
$ lr-muck -p name="Name the Package" -p description="Describe the Package" -s devDependencies.stuff=1.7.0 -s dependencies.other=1.0.0 -c -C -n config.json
```

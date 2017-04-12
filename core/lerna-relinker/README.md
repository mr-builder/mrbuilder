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

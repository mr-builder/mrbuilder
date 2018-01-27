mrbuilder - Mono Repo Builder
===
A tool for developing javascript in monorepos.

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

*** Placeholder  Use at own risk -- Under development***


## What is it
Its a set of configurable tools, that are coordinated through one options manager.
This manager (mrbuilder-optionsmanager) tries to pull out all of settings
from the env, arguments, and configuration to create a list of all configured plugin.

The tool then can be fed into other things like babel or webpack, so that
they can be configured in a uniform fashion.



## Getting Started
To create a project with mrbuilder

```sh
$ yarn create mrbuilder-app --name your_project
```

## Working in a multi-repo.
If you want to override the settings for your whole mono-repo you can create
a dev-tool that has the settings you want and then set the env
process.env.MRBUILDER_INTERNAL_PRESETS='your-build-tool'


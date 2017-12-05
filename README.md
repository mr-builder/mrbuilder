mrbuilder - Mono Repo Builder
===
A tool for developing javascript in monorepos.


*** Placeholder  Use at own risk -- Under development***


## What is it
Its a set of configurable tools, that are coordinated through one options manager.
This manager (mrbuilder-optionsmanager) tries to pull out all of settings
from the env, arguments, and configuration to create a list of all configured plugin.

The tool then can be fed into other things like babel or webpack, so that
they can be configured in a uniform fashion.


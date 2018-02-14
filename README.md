![alt mr-builder](./mrbuilder.wiki/mrbuilder.svg)

mrbuilder - Mono Repo Builder
===
A tool for developing javascript in monorepos more documentation [here](https://mr-builder.github.io)

[![Build Status](https://travis-ci.org/mr-builder/mrbuilder.svg?branch=master)](https://travis-ci.org/mr-builder/mrbuilder)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## What is it
Mr Builder is a "**M**ono **R**epo" build tool.  Its designed to be declarative way
of quickly creating and managing builds within a mono repo.  In particular JS/ES6+
modules. While lerna concerns itself with the packaging it does not define
much in the way of writing apps in a modern javascript pipeline.  While Mr Builder
is designed to be declarative its also meant to leverage existing knowledge of babel,
webpack, mocha and other tools that while all great, may not always work together easily.


Large projects often benefit from being broken into smaller more independent
;more testable modules.  However this causes a new pain point trying to test
and maintain different builds and build systems.   While webpack et al, offer
a rich plugin ecosystem, for each project a new configuration must be enabled.
Mr Builder allows you to make a plugin for these configuration and reuse them
for all the modules; often without having to modify the modules themselves.

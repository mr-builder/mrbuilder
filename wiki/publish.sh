#!/usr/bin/env bash
pushd lib/mr-builder.github.io
git init
git remote add origin git@github.com:mr-builder/mr-builder.github.io.git
git add -A
git commit -a -m 'new version'
git push -f origin master

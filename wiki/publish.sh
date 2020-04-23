#!/usr/bin/env bash
pushd lib/mr-builder.github.io && \
git init && \
(git remote add origin git@github.com:mr-builder/mr-builder.github.io.git 2>/dev/null || echo 'origin exists') && \
git add -A && \
git commit -a -m "publish $(date +'%Y/%m/%d')" && \
git push -f origin master

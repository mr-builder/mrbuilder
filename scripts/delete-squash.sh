#!/usr/bin/env bash
# https://github.com/not-an-aardvark/git-delete-squashed
git for-each-ref refs/heads/ "--format=%(refname:short)" | while read branch; do
  mergeBase=$(git merge-base master $branch)

   if [[ $(git cherry master $(git commit-tree $(git rev-parse $branch\^{tree}) -p $mergeBase -m _)) == "-"* ]] ;then
     echo $branch
     git branch -D $branch;
   fi
done

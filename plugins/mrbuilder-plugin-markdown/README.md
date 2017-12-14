mrbuilder-plugin-markdown
===
This plugin is meant to be used with [mrbuilder](https://github.com/jspears/mrbuilder)

## Installation
```shell
 $ yarn add mrbuilder-plugin-markdown -D
```

## Table support

```markdown

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |


```
Should be rendered as

| Left-aligned | Center-aligned | Right-aligned |
| :---         |     :---:      |          ---: |
| git status   | git status     | git status    |
| git diff     | git diff       | git diff      |


## This shows line breaks
Hello and ' are escaped {this to}'
world

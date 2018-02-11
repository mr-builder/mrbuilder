This plugin provides markdown support.  It probable should not be used,
but is so... Should probably replace with [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx)

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

## This shows inline html
It needs to be inline <span className='inline-hello' style="font-weight:bold;color:red">Hello</span>

This plugin provides markdown support.

- [ ] not done
- [x] done

The advantage of this markdown implementation over the [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx)
is this  compiled to react components, rather than parsing the content in the browser
to extract content.

So it can easily include paths like the one below.

![alt logo](../../wiki/mrbuilder.svg)

and inline _stuff_

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



- list item 1
- list item 2

1) is first
2) is second


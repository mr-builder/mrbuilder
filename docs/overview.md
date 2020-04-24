```js
<img src={require('@mrbuilder/wiki/mrbuilder.svg')}/>
```

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


Using mrbuilder you can get advanced builds, along with easy to use documentation.

A couple of blog posts for getting started.
  [Why I wrote MrBuilder ](https://medium.com/@speajus/why-i-wrote-mrbuilder-a1cd8c110c3d)
  and
  [Monorepos for Styleguides]( https://medium.com/@speajus/monorepos-for-styleguides-bbf0abd6ab80)

### Why Mr Builder
I really didn't want to write another build tool.  Webpack is great, lerna, babel, mocha
all are good things.   However they do not work well with large multi-module projects;
its not their fault, but 50 module projects can't be managed with individual build
files, each with >90% of the same stuff.  As soon as you need to make a global change,
you are pretty much out of luck.  Lerna helps managing the dependencies but doesn't
handle building; webpack handles building but does not do much in the way of
consistency across modules.   Even if webpack did its programmatic configuration is makes
global changes across dozens of modules hard, like really hard.  So mrbuilder tries
to make building modules consistent, across a bunch of projects.  The starter kits
don't help with evolution of a module, and almost always concentrate on top level projects.
So I built mrbuilder.   Let me know if you have issues by reporting on
the [github.com](https://github.com/mr-builder/mrbuilder/issues) issues board.





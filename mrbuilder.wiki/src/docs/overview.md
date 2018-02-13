```js
<img src={require('../../mrbuilder.svg')}/>
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


### Why Mr Builder
- instead of react-create-app, its designed for building the entire
  app not entire sets of modules, therefore any configuration change has to be replicated.
- just webpack - if you only have one or two modules sure, its great but it does not scale
  to dozens or hundreds.
- custom tools - sure you can get exactly what you want, but... its all on you.


Mr Builder does not do anything fancy with the scripts it wraps, however it
does print a lot of information if `MRBUILDER_DEBUG` is set in the environment.

```sh
  $ MRBUILDER_DEBUG=1 yarn run start
```

If webpack is being loaded it will spit out the configuration before it is
run.

IDE debuggers should "just work".  Mr Builder is deliberately synchronise to make
debugging as easy as possible.


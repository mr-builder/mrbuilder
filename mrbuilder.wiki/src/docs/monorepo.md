Why do I need a monorepo.

So there are a few questions you should ask yourself.

1. Does my project have many components that could be used by other projects?
2. Do these components need their own lifecycle, documentation and dependencies?
3. Do these components have interdependencies that should be kept in sync.
    That is does module C depend on B and module D depends on C and B?


If you have answered Y to at 2 of the above questions.  Here's some for helping
determine if mr builder is right for you.

1. Should my components have a similar build system?
2. Do I need babel and or webpack to build said components?
3. Am I sick of maintaining dozens of build files?
4. Am I willing to give up some opinions to make building things easier?

If you have 3 or more of these questions, than maybe mr builder is right for you.

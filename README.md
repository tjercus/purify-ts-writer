
Writer Monad

This is a simple implementation of the Writer monad in TS. 
The Writer monad is used to accumulate a log while performing a computation.
When an Either is not the right choice (because it bails on the first Left in the chain) 
and instead you want to keep track of the log, the Writer monad is a good choice.

The lib is meant as an addition to the excellent purify-ts lib.
The lib is fantasy-land compliant.

See the src/example.ts file for a simple use case.
More examples can be found in the tests.


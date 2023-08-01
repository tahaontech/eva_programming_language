# Building an Interpreter from scratch

As mentioned in the repo, we want to understand and implement every piece of detail from the interpreter themselves, instead of copy-pasting from the final solution.

Example:

```eva
(import Math)

(var abs (prop Math abs))

(var x (- 10))

(print (abs x))
```

Test:

The test runner is located in `__tests__/run.js` which can be executed to validate solutions by following command.

```shell
npm run test
```

# Building an Interpreter from scratch

As mentioned in the repo, we want to understand and implement every piece of detail from the interpreter themselves, instead of copy-pasting from the final solution.

Running on unix based systems:

```shell
sudo chmod +x bin/eva
```

Simple expressions( returns 10):

```shell
./bin/eva -e '(var x 10) (print x)'
```

Run script file

```shell
./bin/eva -f test.eva
```

Outputs:

```shell
10
Value: 60
```

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

// TODO:

- Other data structures:

  (var base (object (value 100)))

  (object
    (x 10)
    (y 20)
    (__proto__ base))

  (var values (list 42 "Hello" foo))

  values[0]

  (idx values 0) // 42
  (idx values 1) // "Hello"

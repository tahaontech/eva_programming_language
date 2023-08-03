const assert = require('assert');
const { test } = require('./test-util');

module.exports = eva => {

    test(eva, 
        `
        (begin
            
            (def square (x)
                (* x x))
            
                (square 2)

        )
        `,
    4);

    test(eva, 
        `
        (begin
            
            (def calc (x y)
                (begin
                    (var z 30)
                    (+ (* x y) z)
                )
            )
            
            (calc 10 20)

        )
        `,
    230);

    // recursive functions:
    test(eva, 
        `
        (begin
            
            (def fac (x)
                (if (= x 1)
                    1
                    (* x (fac (- x 1)))
                )
            )
            
            (fac 5)

        )
        `,
    120);
};
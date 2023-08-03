const assert = require('assert');
const { test } = require('./test-util');

module.exports = eva => {

    // Math functions:

    test(eva,'(+ 2 4)' , 6);
    assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
    assert.strictEqual(eva.eval(['+', ['*', 3, 2], 5]), 11);

    // Comparison: 

    test(eva, '(> 1 5)', false);
    test(eva, '(< 1 5)', true);

    test(eva, `(>= 5 5)`, true);
    test(eva, `(<= 5 5)`, true);
    test(eva, `(= 5 5)`, true);
    
}
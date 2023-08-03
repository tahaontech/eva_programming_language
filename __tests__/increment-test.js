const { test } = require('./test-util');

module.exports = eva => {
    test(eva,
    `
    (begin
        (var foo 2)
        (set foo (+ foo 1))
        foo
    )
    `,
    3)
}
const Eva = require('../Eva');
const Environment = require('../Environment');

const tests = [
    require('./self-eval-test.js'),
    require('./math-test.js'),
    require('./variables-test.js'),
    require('./block-test.js'),
    require('./if-test.js'),
    require('./while-test.js'),
    require('./built-in-function-test.js'),
    require('./user-defined-function-test.js'),
    require('./lambda-function-test.js'),
    require('./switch-test.js'),
    require('./increment-test.js'),
    require('./class-test.js'),
    require('./module-test.js'),
    require('./import-test.js'),
];

const eva = new Eva();

function exec(code) {
  const exp = evaParser.parse(code);
  return eva.eval(exp);
}

tests.forEach(test => test(eva));

console.log('All assertions passed!');
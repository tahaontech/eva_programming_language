const assert = require("assert");

const Environment = require("./Environment");
const Transformer = require("./transform/Transformer");

/**
 * Eva Interpreter
 */
class Eva {
  /**
   * Creates an Eva instance with the global environment.
   */
  constructor(_global = GlobalEnvironment) {
    this.global = _global;
    this._transformer = new Transformer();
  }

  /**
   * Evaluate an expression in the given environment
   */
  eval(exp, env = this.global) {
    if (this._isNumber(exp)) {
      return exp;
    }

    if (this._isString(exp)) {
      return exp.slice(1, -1);
    }

    // -------------------------------------------------
    // Variable declaration: (var foo 10)

    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // -------------------------------------------------
    // Variable update: (set foo 10)

    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // -------------------------------------------------
    // Variable access: foo
    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    // -------------------------------------------------
    // Block:
    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // -------------------------------------------------
    // if-expression:
    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    // -------------------------------------------------
    // switch-expression:
    if (exp[0] === "switch") {
        const ifExp = this._transformer
            .transformSwitchToIf(exp);
        return this.eval(ifExp, env);
    }

    // -------------------------------------------------
    // ++-operator:
    if (exp[0] === "++") {
        const setExp = this._transformer.transformIncToSet(exp)
        return this.eval(setExp, env);
    }

    // -------------------------------------------------
    // while-expression:
    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // -------------------------------------------------
    // Function decleration: (def square (x) (* x x))
    // syntatic sugar
    if (exp[0] === "def") {
      //   JIT-transpile to a variable declaration
      const varExp = this._transformer
        .transformToVarLambda(exp);

      return this.eval(varExp, env);
    }

    // -------------------------------------------------
    // Lambda Function: (lambda (x) (* x x))
    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env, // Closure!
      };
    }

    // -------------------------------------------------
    // Function calls:
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // Native functions:
      if (typeof fn === "function") {
        return fn(...args);
      }

      // User-defined functions:
      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(
        activationRecord,
        fn.env // static scope
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
  }

  _evalBlock(block, env) {
    let result;

    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }

  _isNumber(exp) {
    return typeof exp === "number";
  }

  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }

  _isVariableName(exp) {
    return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
  }
}

/**
 * Default Global Environment
 */
const GlobalEnvironment = new Environment({
  null: null,

  true: true,
  false: false,

  VERSION: "0.1",

  // Operators:
  "+"(op1, op2) {
    return op1 + op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },

  //   Comparison:
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },

  //   Console output:
  print(...args) {
    console.log(...args);
  },
});

module.exports = Eva;

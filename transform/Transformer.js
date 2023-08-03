/**
 * AST Transformer
 */
class Transformer {
  /**
   * Translate `def` - expression (function declaration)
   * into a variable declaration with a lambda exparation
   */
  transformToVarLambda(defExp) {
    const [_tag, name, params, body] = defExp;
    return ["var", name, ["lambda", params, body]];
  }

  /**
   * transform switch to nested if - exparation
   */
  transformSwitchToIf(exp) {
    const [_tag, ...cases] = exp;

    const ifExp = ['if', null, null, null];

    let current = ifExp;

    for (let i = 0; i < cases.length -1; i++) {
        const [currentCond, currentBlock] = cases[i];

        current[1] = currentCond;
        current[2] = currentBlock;

        const next = cases[i + 1];
        const [nextCond, nextBlock] = next;

        current[3] = nextCond === 'else' ? nextBlock : ['if'];

        current = current[3];
    }

    return ifExp;
  }

  /**
   * 
   */
  transformIncToSet(exp) {
    const [_tag, variable] = exp;
    return ['set', `${variable}`, ['+', `${variable}`, 1]];
  }
}

module.exports = Transformer;

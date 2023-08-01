/**
 * Environment: names storage
 */
class Environment {
    /**
     * Creates an environment with the given record.
     */
    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent;
    }

    /**
     * Creates a variable with the given name and value
     * @param {string} name 
     * @param {any} value 
     * @returns value
     */
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    /**
     * Updates an existing variable.
     * @param {*} name 
     * @param {*} value 
     * @returns variable
     */
    assign(name, value) {
        this.resolve(name).record[name] = value;
        return value;
    }

    /**
     * lookup a variable from hashmap
     * @param {string} name 
     * @returns stored value
     */
    lookup(name) {
        return this.resolve(name).record[name];
    }

    /**
     * resolving environments
     * @param {*} name of variable
     * @returns specific environment in which a variable is defined, or throw if
     * variable is not defined.
     */
    resolve(name) {
        if (this.record.hasOwnProperty(name)) {
            return this;
        }

        if(this.parent == null) {
            throw new ReferenceError(`Variable "${name}" is not defined`);
        }

        return this.parent.resolve(name);
    }
}

module.exports = Environment
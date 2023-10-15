"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class representing a back-end object.
 * It provides methods to set various properties of a back-end object.
 */
class BEObject {
    /**
     * Sets multiple properties on the BEObject instance.
     *
     * @param {Object.<string, any>} params - An object with keys as the property
     * names and values as the property values.
     * @return {BEObject} - The current instance to allow method chaining.
     */
    sets(params) {
        Object.entries(params).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Sets a single property on the BEObject instance.
     *
     * @param {string} key - The name of the property.
     * @param {any} value - The value of the property.
     * @return {BEObject} - The current instance to allow method chaining.
     */
    set(key, value) {
        const dummy = { key, value }; // @typescript-eslint/no-unused-vars
        console.log(dummy);
        return this;
    }
}
exports.default = BEObject;

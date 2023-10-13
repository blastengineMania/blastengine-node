import BERequest from "./request";
/**
 * Base class representing a back-end object.
 * It provides methods to set various properties of a back-end object.
 */
export default class BEObject {
    /**
     * Static instance of BERequest used for making requests.
     * @type {BERequest}
     * @static
     */
    static request: BERequest;
    /**
     * Sets multiple properties on the BEObject instance.
     *
     * @param {Object.<string, any>} params - An object with keys as the property
     * names and values as the property values.
     * @return {BEObject} - The current instance to allow method chaining.
     */
    sets(params: {
        [key: string]: unknown;
    }): BEObject;
    /**
     * Sets a single property on the BEObject instance.
     *
     * @param {string} key - The name of the property.
     * @param {any} value - The value of the property.
     * @return {BEObject} - The current instance to allow method chaining.
     */
    set(key: string, value: unknown): BEObject;
}

import BEObject from "./object";
import { SearchLogCondition, SearchLogResult } from "../../types/";
/**
 * Class representing a log, extending the BEObject class.
 * Provides methods to set log properties,
 * create a log instance from JSON, and find logs based on conditions.
 *
 * @extends {BEObject}
 */
export default class Log extends BEObject {
    /** @type {string} */
    email?: string;
    /** @type {number} */
    maillogId?: number;
    /** @type {Date} */
    openTime?: Date;
    /** @type {string} */
    lastResponseMessage?: string;
    /** @type {string} */
    lastResponseCode?: string;
    /** @type {number} */
    deliveryId?: number;
    /** @type {string} */
    deliveryType?: string;
    /** @type {string} */
    status?: string;
    /** @type {Date} */
    deliveryTime?: Date;
    /** @type {Date} */
    createdTime?: Date;
    /** @type {Date} */
    updatedTime?: Date;
    /**
     * Creates a new Log instance from a JSON object.
     *
     * @param {SearchLogResult} params - The JSON object.
     * @return {Log} - The new Log instance.
     */
    static fromJson(params: SearchLogResult): Log;
    /**
     * Sets a property value on the Log instance.
     *
     * @param {string} key - The property key.
     * @param {unknown} value - The property value.
     * @return {Log} - The current Log instance.
     */
    set(key: string, value: unknown): Log;
    /**
     * Finds logs based on specified conditions.
     *
     * @param {SearchLogCondition} [params] - The search conditions.
     * @return {Promise<Log[]>} - A promise that resolves
     * to an array of Log instances.
     * @static
     * @async
     */
    static find(params?: SearchLogCondition): Promise<Log[]>;
}

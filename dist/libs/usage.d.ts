import BEObject from "./object";
import { UsageResponseDataFormat } from "../../types/";
/**
 * The `Usage` class extends `BEObject` to represent and manage usage data.
 */
export default class Usage extends BEObject {
    /**
     * The month for which usage data is represented.
     * @type {number | undefined}
     */
    month?: number;
    /**
     * The current usage.
     * @type {number | undefined}
     */
    current?: number;
    /**
     * The remaining usage.
     * @type {number | undefined}
     */
    remaining?: number;
    /**
     * The time when the usage data was last updated.
     * @type {string | undefined}
     */
    updateTime?: string;
    /**
     * The ID of the plan being used.
     * @type {string | undefined}
     */
    planId?: string;
    /**
     * Constructs a `Usage` instance with the provided data.
     * @param {UsageResponseDataFormat} params - The usage data.
     */
    constructor(params: UsageResponseDataFormat);
    /**
     * Sets the usage data.
     * @param {UsageResponseDataFormat} params - The usage data.
     */
    setParams(params: UsageResponseDataFormat): void;
    /**
     * Retrieves the usage data for the specified month.
     * @param {number} monthAgo - The number of months ago
     * to retrieve usage data for.
     * @return {Promise<Usage[]>} - The usage data.
     */
    static get(monthAgo?: number): Promise<Usage[]>;
    /**
     * Retrieves the latest usage data.
     * @return {Promise<Usage>} - The usage data.
     */
    static getLatest(): Promise<Usage>;
    /**
     * Retrieves the usage data for the specified month.
     * @return {Promise<Usage>} - The usage data.
     */
    get(): Promise<Usage>;
}

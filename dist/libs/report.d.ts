import BEObject from "./object";
/**
 * The Report class extends the BEObject to handle the creation, retrieval,
 * and downloading of analysis reports related to email delivery.
 */
export default class Report extends BEObject {
    /**
     * Optionally holds the Job ID associated with the report.
     * @type {number | undefined}
     */
    jobId?: number;
    /**
     * The unique identifier for a delivery.
     * @type {number}
     */
    deliveryId: number;
    /**
     * The percentage of the report.
     * @type {number}
     */
    percentage: number;
    /**
     * The status of the report.
     * @type {string}
     */
    status: string;
    /**
     * The URL of the report.
     * @type {string}
     */
    mailOpenFileUrl: string;
    /**
     * The total count of the report.
     * @type {number}
     */
    totalCount: number;
    /**
     * The report of the report.
     * @type {string}
     */
    report: unknown;
    /**
     * Constructs a new instance of the Report class.
     *
     * @param {number} deliveryId - The unique identifier for a delivery.
     */
    constructor(deliveryId: number);
    /**
     * Creates a new report.
     *
     * @async
     * @return {Promise<number>} - The Job ID associated with the report.
     */
    create(): Promise<number>;
    /**
     * Retrieves the report data.
     *
     * @async
     * @return {Promise<void>}
     */
    get(): Promise<void>;
    /**
     * Checks if the report is finished.
     *
     * @async
     * @return {Promise<boolean>} - True if the report is finished.
     */
    finished(): Promise<boolean>;
    /**
     * Downloads the report.
     *
     * @async
     * @return {Promise<any>} - The report.
     */
    download(): Promise<unknown>;
}

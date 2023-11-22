import BEObject from "./object";
/**
 * Class representing an error report, extending the BEObject class.
 * Provides methods to set error report parameters,
 * create, get, check if finished, and download the error report.
 *
 * @extends {BEObject}
 */
export default class ErrorReport extends BEObject {
    /**
     * The job identifier for the error report.
     * @type {number}
     */
    jobId?: number;
    /**
     * The percentage of the error report.
     * @type {number}
     */
    percentage: number;
    /**
     * The status of the error report.
     * @type {string}
     */
    status: string;
    /**
     * The URL of the error report.
     * @type {string}
     */
    errorFileUrl: string;
    /**
     * The total count of the error report.
     * @type {number}
     */
    total_count: number;
    /**
     * The report of the error report.
     * @type {Object<string, string | number | Date>[]}
     */
    report?: {
        [key: string]: string | number | Date;
    }[];
    /**
     * The date string of error report start date.
     * @type {string}
     */
    private _errorStart?;
    /**
     * The date string of error report end date.
     * @type {string}
     */
    private _errorEnd?;
    /**
     * The email address of error report.
     * @type {string}
     */
    private _email?;
    /**
     * The response code of error report.
     * @type {number[]}
     */
    private _responseCode;
    /**
     * The format of error report date.
     * @type {string}
     */
    private _format;
    /**
     * Constructs a new instance of the ErrorReport class.
     */
    constructor();
    /**
     * Sets the start time for the error report.
     *
     * @param {Date} start - The start time.
     * @return {ErrorReport} - The current instance.
     */
    setErrorStart(start: Date): ErrorReport;
    /**
     * Sets the end time for the error report.
     *
     * @param {Date} end - The end time.
     * @return {ErrorReport} - The current instance.
     */
    setErrorEnd(end: Date): ErrorReport;
    /**
     * Sets the email for the error report.
     *
     * @param {string} email - The email.
     * @return {ErrorReport} - The current instance.
     */
    setEmail(email: string): ErrorReport;
    /**
     * Sets the response code for the error report.
     *
     * @param {number[]} code - The response code.
     * @return {ErrorReport} - The current instance.
     */
    setResponseCode(code: number[]): ErrorReport;
    /**
     * Creates a new error report.
     *
     * @async
     * @return {Promise<number>} - The job ID of the created error report.
     */
    create(): Promise<number>;
    /**
     * Retrieves the error report data.
     *
     * @async
     * @return {Promise<void>}
     */
    get(): Promise<void>;
    /**
     * Checks if the error report is finished.
     *
     * @async
     * @return {Promise<boolean>} - A boolean indicating whether the error report
     * is finished.
     */
    finished(): Promise<boolean>;
    /**
     * Downloads the error report data.
     *
     * @async
     * @return {Promise<unknown>} - The report data.
     */
    download(): Promise<unknown>;
}

import BEObject from "./object";
import { JobResponseFormat } from "../../types/";
/**
 * Class representing a job, extending the BEObject class.
 * Provides methods to get job details, check for errors,
 * download error information, and check if the job is finished.
 *
 * @extends {BEObject}
 */
export default class Job extends BEObject {
    /**
     * The unique identifier for the job.
     * @type {number}
     */
    id: number;
    /**
     * The total count of the job.
     * @type {number}
     */
    totalCount?: number;
    /**
     * The percentage of the job.
     * @type {number}
     */
    percentage?: number;
    /**
     * The success count of the job.
     * @type {number}
     */
    successCount?: number;
    /**
     * The failed count of the job.
     * @type {number}
     */
    failedCount?: number;
    /**
     * The status of the job.
     * @type {string}
     */
    status?: string;
    /**
     * The report of the job.
     * @type {string}
     */
    report?: string;
    /**
     * Constructs a new instance of the Job class.
     *
     * @param {number} id - The unique identifier for the job.
     */
    constructor(id: number);
    /**
     * Retrieves the job data.
     *
     * @async
     * @return {Promise<JobResponseFormat>} - The job data.
     * @throws Will throw an error if id is not found.
     */
    get(): Promise<JobResponseFormat>;
    /**
     * Checks if the job has errors.
     *
     * @async
     * @return {Promise<boolean>} - True if the job has errors, false otherwise.
     * @throws Will throw an error if id is not found.
     */
    isError(): Promise<boolean>;
    /**
     * Downloads the error information.
     *
     * @async
     * @return {Promise<string>} - The error information.
     * @throws Will throw an error if id is not found.
     */
    download(): Promise<string>;
    /**
     * Checks if the job is finished.
     *
     * @async
     * @return {Promise<boolean>} - True if the job is finished, false otherwise.
     */
    finished(): boolean;
}

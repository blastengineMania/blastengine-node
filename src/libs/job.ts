// import {BlastEngine} from "..";
// import {promisify} from "util";
import BEObject from "./object";
import * as JSZip from "jszip";
import {JobResponseFormat} from "../../types/";

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
  public id: number;
  /**
   * The total count of the job.
   * @type {number}
   */
  public totalCount?: number;
  /**
   * The percentage of the job.
   * @type {number}
   */
  public percentage?: number;
  /**
   * The success count of the job.
   * @type {number}
   */
  public successCount?: number;
  /**
   * The failed count of the job.
   * @type {number}
   */
  public failedCount?: number;
  /**
   * The status of the job.
   * @type {string}
   */
  public status?: string;
  /**
   * The report of the job.
   * @type {string}
   */
  public report?: string;

  /**
   * Constructs a new instance of the Job class.
   *
   * @param {number} id - The unique identifier for the job.
   */
  constructor(id: number) {
    super();
    this.id = id;
  }

  /**
   * Retrieves the job data.
   *
   * @async
   * @return {Promise<JobResponseFormat>} - The job data.
   * @throws Will throw an error if id is not found.
   */
  async get(): Promise<JobResponseFormat> {
    if (!this.id) throw new Error("Job id is not found.");
    const url = `/deliveries/-/emails/import/${this.id}`;
    const res = await Job.request.send("get", url) as JobResponseFormat;
    this.totalCount = res.total_count;
    this.percentage = res.percentage;
    this.successCount = res.success_count;
    this.failedCount = res.failed_count;
    this.status = res.status;
    return res;
  }

  /**
   * Checks if the job has errors.
   *
   * @async
   * @return {Promise<boolean>} - True if the job has errors, false otherwise.
   * @throws Will throw an error if id is not found.
   */
  async isError(): Promise<boolean> {
    const report = await this.download();
    return report !== "";
  }

  /**
   * Downloads the error information.
   *
   * @async
   * @return {Promise<string>} - The error information.
   * @throws Will throw an error if id is not found.
   */
  async download(): Promise<string> {
    if (!this.id) throw new Error("Job id is not found.");
    if (this.report) return this.report;
    const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
    try {
      const buffer = await Job.request
        .send("get", url, {binary: true}) as Buffer;
      const jsZip = await JSZip.loadAsync(buffer);
      const fileName = Object.keys(jsZip.files)[0];
      const zipObject = jsZip.files[fileName];
      this.report = await zipObject.async("text");
      return this.report!;
    } catch (e) {
      const error = JSON.parse(e as string);
      if (error &&
        error.error_messages &&
        error.error_messages.main &&
        error.error_messages.main[0] === "no data found."
      ) {
        return "";
      }
      throw e;
    }
  }

  /**
   * Checks if the job is finished.
   *
   * @async
   * @return {Promise<boolean>} - True if the job is finished, false otherwise.
   */
  finished(): boolean {
    this.get();
    return this.percentage === 100;
  }
}

import BEObject from "./object";
import JSZip from "jszip";
import {format} from "date-fns-tz";
import {
  ErrorMessage,
  GetErrorReportResponseFormat,
  SuccessJsonFormat,
} from "../../types/";

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
  public jobId?: number;
  /**
   * The percentage of the error report.
   * @type {number}
   */
  public percentage: number = 0;
  /**
   * The status of the error report.
   * @type {string}
   */
  public status: string = "";
  /**
   * The URL of the error report.
   * @type {string}
   */
  public errorFileUrl: string = "";
  /**
   * The total count of the error report.
   * @type {number}
   */
  public total_count: number = 0;

  /**
   * The report of the error report.
   * @type {Object<string, string | number | Date>[]}
   */
  public report?: {[key: string]: string | number | Date}[];

  /**
   * The date string of error report start date.
   * @type {string}
   */
  private _errorStart?: string;
  /**
   * The date string of error report end date.
   * @type {string}
   */
  private _errorEnd?: string;
  /**
   * The email address of error report.
   * @type {string}
   */
  private _email?: string;
  /**
   * The response code of error report.
   * @type {number[]}
   */
  private _responseCode: number[] = [];

  /**
   * The format of error report date.
   * @type {string}
   */
  private _format: string = "yyyy-MM-dd'T'HH:mm:ssXXX";

  /**
   * Constructs a new instance of the ErrorReport class.
   */
  constructor() {
    super();
  }

  /**
   * Sets the start time for the error report.
   *
   * @param {Date} start - The start time.
   * @return {ErrorReport} - The current instance.
   */
  setErrorStart(start: Date): ErrorReport {
    this._errorStart = format(start, this._format, {timeZone: "Asia/Tokyo"});
    return this;
  }

  /**
   * Sets the end time for the error report.
   *
   * @param {Date} end - The end time.
   * @return {ErrorReport} - The current instance.
   */
  setErrorEnd(end: Date): ErrorReport {
    this._errorEnd = format(end, this._format, {timeZone: "Asia/Tokyo"});
    return this;
  }

  /**
   * Sets the email for the error report.
   *
   * @param {string} email - The email.
   * @return {ErrorReport} - The current instance.
   */
  setEmail(email: string): ErrorReport {
    this._email = email;
    return this;
  }

  /**
   * Sets the response code for the error report.
   *
   * @param {number[]} code - The response code.
   * @return {ErrorReport} - The current instance.
   */
  setResponseCode(code: number[]): ErrorReport {
    this._responseCode = code;
    return this;
  }

  /**
   * Creates a new error report.
   *
   * @async
   * @return {Promise<number>} - The job ID of the created error report.
   */
  async create(): Promise<number> {
    const url = "/errors/list";
    const body: {[key: string]: string | number[]} = {};
    if (this._errorStart) body["error_start"] = this._errorStart;
    if (this._errorEnd) body["error_end"] = this._errorEnd;
    if (this._email) body["email"] = this._email;
    if (this._responseCode.length > 0) {
      body["response_code"] = this._responseCode;
    }
    const res = await ErrorReport.request
      .send("post", url, body) as SuccessJsonFormat;

    this.jobId = res.job_id!;
    return this.jobId!;
  }

  /**
   * Retrieves the error report data.
   *
   * @async
   * @return {Promise<void>}
   */
  async get(): Promise<void> {
    if (!this.jobId) {
      await this.create();
    }
    const path = `/errors/list/${this.jobId}`;
    const res = await ErrorReport.request
      .send("get", path) as GetErrorReportResponseFormat;
    this.percentage = res.percentage;
    this.status = res.status;
    if (res.total_count) {
      this.total_count = res.total_count;
    }
    if (res.error_file_url) {
      this.errorFileUrl = res.error_file_url;
    }
  }

  /**
   * Checks if the error report is finished.
   *
   * @async
   * @return {Promise<boolean>} - A boolean indicating whether the error report
   * is finished.
   */
  async finished(): Promise<boolean> {
    if (!this.jobId) {
      try {
        await this.create();
      } catch (e: unknown) {
        const messages = JSON.parse(
          (e as Error).message as string) as ErrorMessage;
        if (messages.error_messages &&
          messages.error_messages.main &&
          messages.error_messages.main[0] === "no data found.") {
          return true;
        }
      }
    }
    await this.get();
    return this.percentage === 100;
  }

  /**
   * Downloads the error report data.
   *
   * @async
   * @return {Promise<unknown>} - The report data.
   */
  async download(): Promise<unknown> {
    if (this.report) return this.report;
    if (this.percentage < 100) return [];
    const url = `/errors/list/${this.jobId}/download`;
    const buffer = await ErrorReport.request.send("get", url) as Buffer;
    const jsZip = await JSZip.loadAsync(buffer);
    const fileName = Object.keys(jsZip.files)[0];
    const zipObject = jsZip.files[fileName];
    const text = await zipObject.async("text");
    const lines = text.split(/\r|\n|\r\n/);
    this.report = [];
    for (const line of lines.slice(1)) {
      if (line === "") continue;
      const values = line.split(",").map((v) => v.replace(/^"|"$/g, ""));
      this.report.push({
        id: parseInt(values[0]),
        date: new Date(values[1]),
        email: values[2],
        response_code: values[3],
        error_message: values[4],
      });
    }
    return this.report;
  }
}

import BEObject from "./object";
import JSZip from "jszip";
import {SuccessFormat, GetReportResponseFormat} from "../../types/";

/**
 * The Report class extends the BEObject to handle the creation, retrieval,
 * and downloading of analysis reports related to email delivery.
 */
export default class Report extends BEObject {
  /**
   * Optionally holds the Job ID associated with the report.
   * @type {number | undefined}
   */
  public jobId?: number;
  /**
   * The unique identifier for a delivery.
   * @type {number}
   */
  public deliveryId: number;
  /**
   * The percentage of the report.
   * @type {number}
   */
  public percentage: number = 0;
  /**
   * The status of the report.
   * @type {string}
   */
  public status: string = "";
  /**
   * The URL of the report.
   * @type {string}
   */
  public mailOpenFileUrl: string = "";
  /**
   * The total count of the report.
   * @type {number}
   */
  public totalCount: number = 0;
  /**
   * The report of the report.
   * @type {string}
   */
  public report: unknown;

  /**
   * Constructs a new instance of the Report class.
   *
   * @param {number} deliveryId - The unique identifier for a delivery.
   */
  constructor(deliveryId: number) {
    super();
    this.deliveryId = deliveryId;
  }

  /**
   * Creates a new report.
   *
   * @async
   * @return {Promise<number>} - The Job ID associated with the report.
   */
  async create(): Promise<number> {
    const url = `/deliveries/${this.deliveryId}/analysis/report`;
    const res = await Report.request.send("post", url) as SuccessFormat;
    this.jobId = res.job_id!;
    return this.jobId;
  }

  /**
   * Retrieves the report data.
   *
   * @async
   * @return {Promise<void>}
   */
  async get(): Promise<void> {
    const path = `/deliveries/-/analysis/report/${this.jobId}`;
    const res = await Report.request
      .send("get", path) as GetReportResponseFormat;
    this.percentage = res.percentage;
    this.status = res.status;
    if (res.total_count) {
      this.totalCount = res.total_count;
    }
    if (res.mail_open_file_url) {
      this.mailOpenFileUrl = res.mail_open_file_url;
    }
  }

  /**
   * Checks if the report is finished.
   *
   * @async
   * @return {Promise<boolean>} - True if the report is finished.
   */
  async finished(): Promise<boolean> {
    if (!this.jobId) await this.create();
    await this.get();
    return this.percentage === 100;
  }

  /**
   * Downloads the report.
   *
   * @async
   * @return {Promise<any>} - The report.
   */
  async download(): Promise<unknown> {
    if (this.report) return this.report;
    if (this.percentage < 100) return null;
    const url = `/deliveries/-/analysis/report/${this.jobId}/download`;
    const buffer = await Report.request.send("get", url) as Buffer;
    const jsZip = await JSZip.loadAsync(buffer);
    const fileName = Object.keys(jsZip.files)[0];
    const zipObject = jsZip.files[fileName];
    this.report = await zipObject.async("text");
    return this.report;
  }
}

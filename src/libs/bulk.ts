import Base from "./base";
import {format} from "date-fns-tz";
import Job from "./job";
import Email from "./email";
import {file} from "tmp-promise";
import * as fs from "fs";
import {promisify} from "util";
import {
  Attachment,
  BulkUpdateTo,
  RequestParamsBulkBegin,
  RequestParamsBulkUpdate,
  RequestParamsBulkCommit,
  SuccessJsonFormat,
} from "../../types/";

type InsertCode = {[key: string]: string};
/**
 * Class representing a bulk operation, extending the Base class.
 * Provides methods to register, update, and send bulk deliveries.
 *
 * @extends {Base}
 */
export default class Bulk extends Base {
  /**
   * An array to hold bulk update information.
   * @type {BulkUpdateTo[]}
   */
  to: BulkUpdateTo[] = [];

  /**
   * Registers a new bulk delivery.
   *
   * @async
   * @return {Promise<SuccessFormat>} - The result of the registration.
   */
  async register(): Promise<SuccessJsonFormat> {
    const url = "/deliveries/bulk/begin";
    const res = await Bulk.request
      .send("post", url, this.saveParams()) as SuccessJsonFormat;
    this.deliveryId = res.delivery_id;
    return res;
  }

  /**
   * Imports a file for bulk update.
   *
   * @async
   * @param {Attachment} filePath - The path of the file to import.
   * @return {Promise<Job>} - A Job instance representing the import job.
   * @throws Will throw an error if deliveryId is not found.
   */
  async import(filePath: Attachment): Promise<Job> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = `/deliveries/${this.deliveryId!}/emails/import`;
    const res = await Bulk.request.send("post", url, {
      file: filePath,
    }) as SuccessJsonFormat;
    return new Job(res.job_id!);
  }

  /**
   * Updates the bulk delivery.
   *
   * @async
   * @return {Promise<SuccessFormat>} - The result of the update.
   * @throws Will throw an error if deliveryId is not found.
   */
  async update(): Promise<SuccessJsonFormat> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const params = this.updateParams();
    if (params.to && params.to.length > 50) {
      const csv = this.createCsv(params.to);
      const {path} = await file({postfix: ".csv"});
      await promisify(fs.writeFile)(path, csv);
      const job = await this.import(path);
      while (job.finished() === false) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      delete params.to;
    }
    const url = `/deliveries/bulk/update/${this.deliveryId!}`;
    const res = await Bulk.request
      .send("put", url, params) as SuccessJsonFormat;
    return res;
  }

  /**
   * Creates a CSV string from the provided data.
   *
   * @param {BulkUpdateTo[]} to - The data to convert to CSV.
   * @return {string} - The CSV string.
   */
  createCsv(to: BulkUpdateTo[]): string {
    // ヘッダーを作る
    const headers = ["email"];
    for (const t of to) {
      const params = t.insert_code?.map((c) => c.key) || [];
      for (const p of params) {
        if (!headers.includes(p)) headers.push(p);
      }
    }
    const lines = [`"${headers.join("\",\"")}"`];
    for (const t of to) {
      // const params = t.insert_code?.map((c) => c.key) || [];
      const values = [t.email];
      for (const h of headers) {
        if (h === "email") continue;
        const code = t.insert_code?.find((c) => c.key === h);
        values.push(code ? code.value.replace("\"", "\"\"") : "");
      }
      lines.push(`"${values.join("\",\"")}"`);
    }
    return lines.join("\n");
  }

  /**
   * Sends the bulk delivery.
   *
   * @async
   * @param {Date} [date] - The date to send the delivery.
   * @return {Promise<SuccessJsonFormat>} - The result of the send operation.
   * @throws Will throw an error if deliveryId is not found.
   */
  async send(date?: Date): Promise<SuccessJsonFormat> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = date ?
      `/deliveries/bulk/commit/${this.deliveryId!}` :
      `/deliveries/bulk/commit/${this.deliveryId}/immediate`;
    const res = await Bulk.request
      .send("patch", url, this.commitParams(date)) as SuccessJsonFormat;
    return res;
  }

  /**
   * Deletes the bulk delivery.
   *
   * @async
   * @return {Promise<SuccessFormat>} - The result of the delete operation.
   * @throws Will throw an error if deliveryId is not found.
   */
  async delete(): Promise<SuccessJsonFormat> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = `/deliveries/${this.deliveryId!}`;
    const res = await Bulk.request
      .send("delete", url) as SuccessJsonFormat;
    return res;
  }

  /**
   * Cancels the bulk delivery.
   *
   * @async
   * @return {Promise<SuccessJsonFormat>} - The result of the cancel operation.
   * @throws Will throw an error if deliveryId is not found.
   */
  async cancel(): Promise<SuccessJsonFormat> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = `/deliveries/${this.deliveryId!}/cancel`;
    const res = await Bulk.request
      .send("patch", url) as SuccessJsonFormat;
    return res;
  }

  /**
   * Gets an Email instance for the current bulk delivery.
   *
   * @return {Email} - The Email instance.
   * @throws Will throw an error if deliveryId is not found.
   */
  email(): Email {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    return new Email(this.deliveryId!);
  }

  /**
   * Adds a recipient to the bulk delivery.
   *
   * @param {string} email - The email address of the recipient.
   * @param {InsertCode} insertCode - The insert code for the recipient.
   * @return {Bulk} - The current instance.
   */
  addTo(email: string, insertCode?: InsertCode): Bulk {
    const params: BulkUpdateTo = {email};
    params.insert_code = this.hashToInsertCode(insertCode);
    this.to.push(params);
    return this;
  }

  /**
   * Prepares the parameters for saving the bulk delivery.
   *
   * @return {RequestParamsBulkBegin} - The prepared parameters.
   */
  saveParams(): RequestParamsBulkBegin {
    const params: RequestParamsBulkBegin = {
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      subject: this.subject,
      encode: this.encode,
      text_part: this.textPart,
      html_part: this.htmlPart,
    };
    if (this.unsubscribe) {
      params.list_unsubscribe = {};
      if (this.unsubscribe.email) {
        params.list_unsubscribe.mailto = `mailto:${this.unsubscribe.email}`;
      }
      if (this.unsubscribe.url) {
        params.list_unsubscribe.url = this.unsubscribe.url;
      }
    }
    if (this.attachments.length > 0) {
      params.attachments = this.attachments;
    }
    return params;
  }

  /**
   * Prepares the parameters for updating the bulk delivery.
   *
   * @return {RequestParamsBulkUpdate} - The prepared parameters.
   */
  updateParams(): RequestParamsBulkUpdate {
    const params: RequestParamsBulkUpdate = {
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      subject: this.subject,
      to: this.to,
      text_part: this.textPart,
      html_part: this.htmlPart,
    };
    if (this.unsubscribe) {
      params.list_unsubscribe = {};
      if (this.unsubscribe.email) {
        params.list_unsubscribe.mailto = `mailto:${this.unsubscribe.email}`;
      }
      if (this.unsubscribe.url) {
        params.list_unsubscribe.url = this.unsubscribe.url;
      }
    }
    return params;
  }

  /**
   * Prepares the parameters for committing the bulk delivery.
   *
   * @param {Date} [date] - The date to commit the delivery.
   * @return {RequestParamsBulkCommit} - The prepared parameters.
   */
  commitParams(date?: Date): RequestParamsBulkCommit {
    if (!date) return {};
    const reservationTime = format(date, "%FT%T%z", {timeZone: "Asia/Tokyo"})
      .replace("+0900", "+09:00");
    return {
      reservation_time: reservationTime,
    };
  }
}

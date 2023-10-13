import BEObject from "./object";
import {
  SearchLogCondition,
  SearchLogResponse,
  SearchLogResult,
} from "../../types/";
import qs from "qs";

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
  static fromJson(params: SearchLogResult): Log {
    const obj = new Log;
    obj.sets(params);
    return obj;
  }

  /**
   * Sets a property value on the Log instance.
   *
   * @param {string} key - The property key.
   * @param {unknown} value - The property value.
   * @return {Log} - The current Log instance.
   */
  set(key: string, value: unknown): Log {
    switch (key) {
    case "delivery_id":
      this.deliveryId = value as number;
      break;
    case "delivery_type":
      this.deliveryType = value as string;
      break;
    case "status":
      this.status = value as string;
      break;
    case "delivery_time":
      if (value) this.deliveryTime = new Date(value as string);
      break;
    case "last_response_code":
      this.lastResponseCode = value as string;
      break;
    case "last_response_message":
      this.lastResponseMessage = value as string;
      break;
    case "open_time":
      if (value) this.openTime = new Date(value as string);
      break;
    case "created_time":
      if (value) this.createdTime = new Date(value as string);
      break;
    case "updated_time":
      if (value) this.updatedTime = new Date(value as string);
      break;
    case "maillog_id":
      this.maillogId = value as number;
      break;
    case "email":
      this.email = value as string;
      break;
    }
    return this;
  }

  /**
   * Finds logs based on specified conditions.
   *
   * @param {SearchLogCondition} [params] - The search conditions.
   * @return {Promise<Log[]>} - A promise that resolves
   * to an array of Log instances.
   * @static
   * @async
   */
  static async find(params?: SearchLogCondition): Promise<Log[]> {
    if (params?.delivery_start && params.delivery_start instanceof Date) {
      params.delivery_start = params.delivery_start.toISOString();
    }
    if (params?.delivery_end && params.delivery_end instanceof Date) {
      params.delivery_end = params.delivery_end.toISOString();
    }
    const query = params ?
      qs.stringify(params).replace(/%5B[0-9]?%5D/g, "%5B%5D") :
      "";
    const url = `/logs/mails/results?${query}`;
    const res = await Log.request.send("get", url) as SearchLogResponse;
    return res.data.map((params) => Log.fromJson(params));
  }
}

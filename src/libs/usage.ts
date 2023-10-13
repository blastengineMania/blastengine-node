import BEObject from "./object";
import {UsageResponseDataFormat, UsageResponseFormat} from "../../types/";

/**
 * The `Usage` class extends `BEObject` to represent and manage usage data.
 */
export default class Usage extends BEObject {
  /**
   * The month for which usage data is represented.
   * @type {number | undefined}
   */
  public month?: number;
  /**
   * The current usage.
   * @type {number | undefined}
   */
  public current?: number;
  /**
   * The remaining usage.
   * @type {number | undefined}
   */
  public remaining?: number;
  /**
   * The time when the usage data was last updated.
   * @type {string | undefined}
   */
  public updateTime?: string;
  /**
   * The ID of the plan being used.
   * @type {string | undefined}
   */
  public planId?: string;

  /**
   * Constructs a `Usage` instance with the provided data.
   * @param {UsageResponseDataFormat} params - The usage data.
   */
  constructor(params: UsageResponseDataFormat) {
    super();
    this.setParams(params);
  }

  /**
   * Sets the usage data.
   * @param {UsageResponseDataFormat} params - The usage data.
   */
  setParams(params: UsageResponseDataFormat): void {
    this.month = params.month;
    this.current = params.current;
    this.remaining = params.remaining;
    this.updateTime = params.update_time;
    this.planId = params.plan_id;
  }

  /**
   * Retrieves the usage data for the specified month.
   * @param {number} monthAgo - The number of months ago
   * to retrieve usage data for.
   * @return {Promise<Usage[]>} - The usage data.
   */
  static async get(monthAgo: number = 1): Promise<Usage[]> {
    const url = "/usages";
    const res = await Usage.request
      .send("get", url, {month_ago: monthAgo}) as UsageResponseFormat;
    return res.data.map((d) => new Usage(d));
  }

  /**
   * Retrieves the latest usage data.
   * @return {Promise<Usage>} - The usage data.
   */
  static async getLatest(): Promise<Usage> {
    const url = "/usages/latest";
    const res = await Usage.request.send("get", url) as UsageResponseDataFormat;
    return new Usage(res);
  }

  /**
   * Retrieves the usage data for the specified month.
   * @return {Promise<Usage>} - The usage data.
   */
  async get(): Promise<Usage> {
    const url = `/usages/${this.month!}`;
    const res = await Usage.request.send("get", url) as UsageResponseDataFormat;
    this.setParams(res);
    return this;
  }
}

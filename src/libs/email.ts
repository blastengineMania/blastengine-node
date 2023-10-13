import BEObject from "./object";
import {
  CreateEmailResponseFormat,
  GetEmailResponseFormat,
  RequestParamsEmailCreate,
} from "../../types/";

/**
 * Class representing an email, extending the BEObject class.
 * Provides methods to get, save, create, update, and delete an email.
 *
 * @extends {BEObject}
 */
export default class Email extends BEObject {
  /**
   * Unique identifier for a delivery.
   * @type {number}
   */
  public deliveryId: number;
  /**
   * Unique identifier for an email.
   * @type {number}
   */
  public emailId?: number;
  /**
   * The email address.
   * @type {string}
   */
  public address?: string;
  /**
   * An object representing the insert code.
   * @type {Object<string, string>}
   */
  public insertCode: {[key: string]: string} = {};
  /**
   * The creation time of the email.
   * @type {Date}
   */
  public createdTime?: Date;
  /**
   * The updated time of the email.
   * @type {Date}
   */
  public updatedTime?: Date;

  /**
   * Constructs a new instance of the Email class.
   *
   * @param {number} deliveryId - The unique identifier for a delivery.
   */
  constructor(deliveryId: number) {
    super();
    this.deliveryId = deliveryId;
  }

  /**
   * Retrieves the email data.
   *
   * @async
   * @return {Promise<number>} - The emailId.
   * @throws Will throw an error if emailId is not found.
   */
  async get(): Promise<number> {
    if (!this.emailId) throw new Error("Email id is not found.");
    const url = `/deliveries/-/emails/${this.emailId}`;
    const res = await Email.request.send("get", url) as GetEmailResponseFormat;
    res.insert_code.forEach((params) => {
      this.insertCode[params.key.replace(/__/, "")] = params.value;
    });
    this.address = res.email;
    this.createdTime = new Date(res.created_time);
    this.updatedTime = new Date(res.updated_time);
    return this.emailId;
  }

  /**
   * Saves the email data.
   *
   * @async
   * @return {Promise<number>} - The emailId.
   */
  async save(): Promise<number> {
    if (!this.emailId) {
      return this.create();
    } else {
      return this.update();
    }
  }

  /**
   * Creates a new email.
   *
   * @async
   * @return {Promise<number>} - The emailId.
   * @throws Will throw an error if deliveryId is not found.
   */
  async create(): Promise<number> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = `/deliveries/${this.deliveryId}/emails`;
    const res = await Email.request
      .send("post", url, this.getParams()) as CreateEmailResponseFormat;
    this.emailId = res.email_id;
    return this.emailId;
  }

  /**
   * Updates the email data.
   *
   * @async
   * @return {Promise<number>} - The emailId.
   * @throws Will throw an error if emailId is not found.
   */
  async update(): Promise<number> {
    if (!this.emailId) throw new Error("Email id is not found.");
    const url = `/deliveries/-/emails/${this.emailId}`;
    await Email.request
      .send("put", url, this.getParams()) as CreateEmailResponseFormat;
    return this.emailId;
  }

  /**
   * Deletes the email data.
   *
   * @async
   * @return {Promise<boolean>} - A boolean indicating success.
   * @throws Will throw an error if emailId is not found.
   */
  async delete(): Promise<boolean> {
    if (!this.emailId) throw new Error("Email id is not found.");
    const url = `/deliveries/-/emails/${this.emailId}`;
    await Email.request
      .send("delete", url) as CreateEmailResponseFormat;
    return true;
  }

  /**
   * Prepares the parameters for creating or updating an email.
   *
   * @return {RequestParamsEmailCreate} - The prepared parameters.
   */
  getParams(): RequestParamsEmailCreate {
    return {
      email: this.address!,
      insert_code: Object.keys(this.insertCode).map((key) => {
        return {key: `__${key}__`, value: this.insertCode[key]};
      }),
    };
  }
}

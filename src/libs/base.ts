import BEObject from "./object";
import Report from "./report";
// import ErrorReport from "./error_report";
// import Bulk from './bulk';
import {
  Attachment,
  GetResponseFormat,
  InsertCode,
  SuccessJsonFormat,
  Unsubscribed,
} from "../../types/";

type FromFormat = {
  name?: string;
  email?: string;
}

/**
 * The Base class extends BEObject and serves as a foundation for
 * handling various message attributes and operations in the context
 * of a message delivery system.
 *
 * @extends {BEObject}
 */
export default class Base extends BEObject {
  /**
   * Unique identifier for a delivery.
   * @type {number}
   */
  deliveryId?: number;
  /**
   * The name of the sender.
   * @type {string}
   */
  public fromName = "";
  /**
   * The email address of the sender.
   * @type {string}
   */
  public fromEmail = "";
  /**
   * The subject of the message.
   * @type {string}
   */
  public subject = "";
  /**
   * The encoding of the message.
   * @type {string}
   */
  public encode = "UTF-8";
  /**
   * The text part of the message.
   * @type {string}
   */
  public textPart = "";
  /**
   * The HTML part of the message.
   * @type {string}
   */
  public htmlPart = "";
  /**
   * The URL of the message.
   * @type {string}
   */
  public url?: string;
  /**
   * Information of unsubscribed
   */
  public unsubscribe: Unsubscribed = {};
  /**
   * The attachments of the message.
   * @type {Attachment[]}
   */
  public attachments: Attachment[] = [];
  /**
   * The public file of the message.
   * @type {Attachment}
   */
  public file?: Attachment;
  /**
   * The delivery type of the message.
   * @type {string}
   */
  public deliveryType?: string;
  /**
   * The status of the message.
   * @type {string}
   */
  public status?: string;
  /**
   * The total count of the message.
   * @type {number}
   */
  public totalCount?: number;
  /**
   * The sent count of the message.
   * @type {number}
   */
  public sentCount?: number;
  /**
   * The drop count of the message.
   * @type {number}
   */
  public dropCount?: number;
  /**
   * The hard error count of the message.
   * @type {number}
   */
  public hardErrorCount?: number;
  /**
   * The soft error count of the message.
   * @type {number}
   */
  public softErrorCount?: number;
  /**
   * The open count of the message.
   * @type {number}
   */
  public openCount?: number;
  /**
   * The delivery time of the message.
   * @type {Date}
   */
  public deliveryTime?: Date;
  /**
   * The reservation time of the message.
   * @type {Date}
   */
  public reservationTime?: Date;
  /**
   * The created time of the message.
   * @type {Date}
   */
  public createdTime?: Date;
  /**
   * The updated time of the message.
   * @type {Date}
   */
  public updatedTime?: Date;

  /**
   * Creates a new instance of Base.
   */
  constructor() {
    super();
  }
  /**
   * Sets a value to a specified property of this instance.
   *
   * @param {string} key - The name of the property.
   * @param {any} value - The value to be assigned.
   * @return {Base} - The current instance.
   */
  set(key: string, value: unknown): Base {
    switch (key) {
    case "delivery_id":
      this.deliveryId = value as number;
      break;
    case "text_part":
      this.textPart = value as string;
      break;
    case "html_part":
      this.htmlPart = value as string;
      break;
    case "total_count":
      this.totalCount = value as number;
      break;
    case "sent_count":
      this.sentCount = value as number;
      break;
    case "drop_count":
      this.dropCount = value as number;
      break;
    case "hard_error_count":
      this.hardErrorCount = value as number;
      break;
    case "soft_error_count":
      this.softErrorCount = value as number;
      break;
    case "open_count":
      this.openCount = value as number;
      break;
    case "from": {
      const val = value as FromFormat;
      if (val.name) {
        this.fromName = val.name;
      }
      if (val.email) {
        this.fromEmail = val.email;
      }
      break;
    }
    case "subject":
      this.subject = value as string;
      break;
    case "status":
      this.status = value as string;
      break;
    case "delivery_time":
      if (value) this.deliveryTime = new Date(value as string);
      break;
    case "reservation_time":
      if (value) this.reservationTime = new Date(value as string);
      break;
    case "created_time":
      this.createdTime = new Date(value as string);
      break;
    case "updated_time":
      this.updatedTime = new Date(value as string);
      break;
    case "delivery_type":
      this.deliveryType = value as string;
      break;
    }
    return this;
  }

  /**
   * Sets the subject of the message.
   *
   * @param {string} subject - The subject text.
   * @return {BEReturnType} - The current instance.
   */
  setSubject(subject: string): Base {
    this.subject = subject;
    return this;
  }

  /**
   * Sets the sender's email and name.
   *
   * @param {string} email - The email address of the sender.
   * @param {string} [name=""] - The name of the sender.
   * @return {BEReturnType} - The current instance.
   */
  setFrom(email: string, name = ""): Base {
    this.fromEmail = email;
    this.fromName = name;
    return this;
  }

  /**
   * Sets the encoding for the message.
   *
   * @param {string} encode - The character encoding.
   * @return {Base} - The current instance.
   */
  setEncode(encode: string): Base {
    this.encode = encode;
    return this;
  }

  /**
   * Sets the text part of the message.
   *
   * @param {string} text - The text content.
   * @return {Base} - The current instance.
   */
  setText(text: string): Base {
    this.textPart = text;
    return this;
  }

  /**
   * Sets the HTML part of the message.
   *
   * @param {string} html - The HTML content.
   * @return {Base} - The current instance.
   */
  setHtml(html: string): Base {
    this.htmlPart = html;
    return this;
  }

  /**
   * Adds an attachment to the message.
   *
   * @param {Attachment} file - The file to be attached.
   * @return {Base} - The current instance.
   */
  addAttachment(file: Attachment): Base {
    this.attachments.push(file);
    return this;
  }
  /**
   * Set unsubscribe information
   *
   * @param {Unsubscribed} params - Information of unsubscribe.
   * @return {Base} - The current instance.
   */
  setUnsubscribe({email, url}: Unsubscribed): Base {
    if (email) this.unsubscribe.email = email;
    if (url) this.unsubscribe.url = url;
    return this;
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
    const res = await Base.request
      .send("patch", url) as SuccessJsonFormat;
    return res;
  }

  /**
   * Retrieves information about the delivery, based on the deliveryId.
   *
   * @async
   * @throws Will throw an error if deliveryId is not found.
   * @return {Promise<void>}
   */
  async get(): Promise<void> {
    if (!this.deliveryId) throw new Error("Delivery id is not found.");
    const url = `/deliveries/${this.deliveryId!}`;
    const res = await Base.request.send("get", url) as GetResponseFormat;
    this.sets(res);
  }

  /**
   * Returns a new Report instance for the current delivery.
   *
   * @return {Report} - A new Report instance.
   */
  report(): Report {
    return new Report(this.deliveryId!);
  }

  /**
   * Converts a hash object to an array of InsertCode objects.
   *
   * @param {Object<string, string>} [hash={}] - The hash object.
   * @return {InsertCode[]} - The array of InsertCode objects.
   */
  hashToInsertCode(hash?: {[key: string]: string}): InsertCode[] {
    if (!hash) return [];
    return Object.keys(hash).map((key) => {
      return {
        key: `__${key}__`,
        value: hash[key],
      };
    });
  }
}

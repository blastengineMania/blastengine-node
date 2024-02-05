import Base from "./base";
import {
  RequestParamsTransaction,
  SuccessJsonFormat,
} from "../../types/";

/**
 * Class representing a transaction operation, extending the Base class.
 * Provides methods to send transaction deliveries.
 *
 * @extends {Base}
 */
export default class Transaction extends Base {
  /**
   * The email address of the sender.
   * @type {string}
   */
  public to = "";

  /**
   * The email address of the sender as Cc.
   * @type {string[]}
   */
  public cc: string[] = [];

  /**
   * The email address of the sender as Bcc.
   * @type {string[]}
   */
  public bcc: string[] = [];

  /**
   * Replace the insert code in the email.
   * @type {{key: string, value: string}[]}
   */
  public insert_code: {key: string, value: string}[] = [];

  /**
   * Set a recipient to the transaction delivery.
   *
   * @param {string} email - The email address of the recipient.
   * @param {InsertCode} insertCode - The insert code for the recipient.
   * @return {BEReturnType} - The current instance.
   */
  setTo(email: string, insertCode?: {[key: string]: string}): Transaction {
    this.to = email;
    this.insert_code = this.hashToInsertCode(insertCode);
    return this;
  }

  /**
   * Add a recipient to the transaction delivery as Cc.
   *
   * @param {string} email - The email address of the recipient.
   * @return {BEReturnType} - The current instance.
   */
  addCc(email: string): Transaction {
    if (this.cc.length >= 10) throw new Error("Cc is limited to 10.");
    this.cc.push(email);
    return this;
  }

  /**
   * Add a recipient to the transaction delivery as Bcc.
   *
   * @param {string} email - The email address of the recipient.
   * @return {BEReturnType} - The current instance.
   */
  addBcc(email: string): Transaction {
    if (this.bcc.length >= 10) throw new Error("Bcc is limited to 10.");
    this.bcc.push(email);
    return this;
  }
  /**
   * Prepares the parameters for sending the transaction delivery.
   *
   * @return {RequestParamsTransaction} - The prepared parameters.
   */
  params(): RequestParamsTransaction {
    const params: RequestParamsTransaction = {
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      to: this.to,
      subject: this.subject,
      text_part: this.textPart,
    };
    if (this.insert_code.length > 0) {
      params.insert_code = this.insert_code;
    }
    if (this.cc.length > 0) {
      params.cc = this.cc;
    }
    if (this.bcc.length > 0) {
      params.bcc = this.bcc;
    }
    if (this.htmlPart) {
      params.html_part = this.htmlPart;
    }
    if (this.attachments.length > 0) {
      params.attachments = this.attachments;
    }
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
   * Sends the transaction delivery.
   *
   * @async
   * @return {Promise<SuccessJsonFormat>} - The success message.
   */
  async send(): Promise<SuccessJsonFormat> {
    const url = "/deliveries/transaction";
    const res = await Transaction.request
      .send("post", url, this.params()) as SuccessJsonFormat;
    this.deliveryId = res.delivery_id;
    return res;
  }
}

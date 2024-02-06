import Base from "./base";
import Bulk from "./bulk";
import Transaction from "./transaction";
import {
  MailConfig,
  SearchCondition,
  SearchResponse,
  SearchResult,
  Attachment,
  Unsubscribed,
  SearchConditionUnsubscribe,
} from "../../types/";

/**
 * Class representing a mail, extending the Base class.
 * Provides methods to set mail properties,
 * create a mail instance from JSON, and find mails based on conditions.
 *
 * @extends {Base}
 */
export default class Mail extends Base {
  /**
   * Configuration parameters for mail.
   * @type {MailConfig}
   */
  params: MailConfig = {
    to: [],
    cc: [],
    bcc: [],
    text_part: undefined,
    html_part: undefined,
    from: undefined,
    encode: "utf-8",
    attachments: [],
  };

  /**
   * Creates a new instance (Bulk or Transaction) from a JSON object.
   *
   * @param {SearchResult} params - The JSON object.
   * @return {Bulk | Transaction} - The new Bulk or Transaction instance.
   * @static
   */
  static fromJson(params: SearchResult): Bulk | Transaction {
    const obj = params.delivery_type === "TRANSACTION" ?
      new Transaction() :
      new Bulk();
    obj.sets(params);
    return obj;
  }

  /**
   * Finds mails based on conditions.
   *
   * @async
   * @param {SearchConditionUnsubscribe} params - The search conditions.
   * @return {Promise<(Bulk | Transaction)[]>} - The search results.
   * @static
   */
  static async find(params?: SearchConditionUnsubscribe):
    Promise<(Bulk | Transaction)[]> {
    if (params?.delivery_start && params.delivery_start instanceof Date) {
      params.delivery_start = params.delivery_start.toISOString();
    }
    if (params?.delivery_end && params.delivery_end instanceof Date) {
      params.delivery_end = params.delivery_end.toISOString();
    }
    const url = "/deliveries";
    const res = await Mail.request.send("get", url, params) as SearchResponse;
    return res.data.map((params) => Mail.fromJson(params));
  }

  /**
   * Finds mails based on conditions.
   *
   * @async
   * @param {SearchCondition} params - The search conditions.
   * @return {Promise<(Bulk | Transaction)[]>} - The search results.
   * @static
   */
  static async all(params?: SearchCondition):
    Promise<(Bulk | Transaction)[]> {
    if (params?.delivery_start && params.delivery_start instanceof Date) {
      params.delivery_start = params.delivery_start.toISOString();
    }
    if (params?.delivery_end && params.delivery_end instanceof Date) {
      params.delivery_end = params.delivery_end.toISOString();
    }
    const url = "/deliveries/all";
    const res = await Mail.request.send("get", url, params) as SearchResponse;
    return res.data.map((params) => Mail.fromJson(params));
  }

  /**
   * Adds a recipient to the mail.
   *
   * @param {string} email - The email address.
   * @param {Object<string, string>} [insertCode] - The insert code.
   * @return {Mail} - The current instance.
   */
  addTo(email: string, insertCode?: {[key: string]: string}): Mail {
    Object.keys(insertCode || {}).forEach((key) => {
      if (key.length > 16) {
        throw new Error("Insert code key is limited to 16.");
      }
      if (key.length < 1) {
        throw new Error("Insert code key is required at least 1.");
      }
    });
    this.params.to.push({email, insert_code: insertCode});
    return this;
  }

  /**
   * Sets the encoding for the message.
   *
   * @param {string} encode - The character encoding.
   * @return {Mail} - The current instance.
   */
  setEncode(encode: string = "utf-8"): Mail {
    if (encode.trim() === "") throw new Error("Encode is required.");
    this.params.encode = encode;
    return this;
  }

  /**
   * Sets the sender for the message.
   *
   * @param {string} email - The email address.
   * @param {string} [name] - The name.
   * @return {Mail} - The current instance.
   */
  setFrom(email: string, name = ""): Mail {
    if (!email || email.trim() === "") throw new Error("Email is required.");
    this.params.from = {
      email,
      name,
    };
    return this;
  }

  /**
   * Sets the subject for the message.
   *
   * @param {string} subject - The subject.
   * @return {Mail} - The current instance.
   */
  setSubject(subject: string): Mail {
    if (!subject || subject.trim() === "") {
      throw new Error("Subject is required.");
    }
    this.params.subject = subject;
    return this;
  }

  /**
   * Sets the text part for the message.
   *
   * @param {string} text - The text.
   * @return {Mail} - The current instance.
   */
  setText(text: string): Mail {
    if (!text || text.trim() === "") {
      throw new Error("Text is required.");
    }
    this.params.text_part = text;
    return this;
  }

  /**
   * Sets the HTML part for the message.
   *
   * @param {string} html - The HTML.
   * @return {Mail} - The current instance.
   */
  setHtml(html: string): Mail {
    if (!html || html.trim() === "") throw new Error("Html is required.");
    this.params.html_part = html;
    return this;
  }

  /**
   * Adds cc email to the mail.
   *
   * @param {string} email - The email address.
   * @return {Mail} - The current instance.
   */
  addCc(email: string): Mail {
    if (!email || email.trim() === "") throw new Error("Email is required.");
    if (!this.params.cc) this.params.cc = [];
    this.params.cc.push(email);
    return this;
  }

  /**
   * Adds bcc email to the mail.
   *
   * @param {string} email - The email address.
   * @return {Mail} - The current instance.
   */
  addBcc(email: string): Mail {
    if (!email || email.trim() === "") throw new Error("Email is required.");
    if (!this.params.bcc) this.params.bcc = [];
    this.params.bcc.push(email);
    return this;
  }

  /**
   * Set unsubscribed information
   *
   * @param {Unsubscribed} params - Information of unsubscribed.
   * @return {Base} - The current instance.
   */
  setUnsubscribed(params: Unsubscribed): Mail {
    return super.setUnsubscribe(params) as Mail;
  }

  /**
   * Adds an attachment to the mail.
   *
   * @param {Attachment} file - The attachment.
   * @return {Mail} - The current instance.
   */
  addAttachment(file: Attachment): Mail {
    if (!file) throw new Error("File is required.");
    if (!this.params.attachments) this.params.attachments = [];
    this.params.attachments.push(file);
    return this;
  }

  /**
   * Send the mail.
   * @param {Date} [sendTime] - The date and time to send the mail.
   * @return {MailConfig} - The prepared parameters.
   */
  async send(sendTime?: Date): Promise<boolean> {
    // CCまたはBCCがある場合はTransaction × Toの分
    // Toが複数の場合はBulk、Toが1つの場合はTransaction
    if ((this.params.cc && this.params.cc!.length > 0) ||
      (this.params.bcc && this.params.bcc.length > 0)) {
      // CCまたはBCCがある場合は、指定時刻送信はできない
      if (sendTime) {
        throw new Error(`CC or BCC is not supported
        when sending at a specified time.`);
      }
      if (this.params.to.length > 1) {
        throw new Error(`CC or BCC is not supported
          when sending to multiple recipients.`);
      }
    }
    if (sendTime || this.params.to.length > 1) {
      return this.sendBulk(sendTime);
    }
    return this.sendTransaction();
  }

  /**
   * Send the mail as Bulk.
   * @param {Date} [sendTime] - The date and time to send the mail.
   * @return {boolean} - The result of the send operation.
   */
  private async sendBulk(sendTime?: Date): Promise<boolean> {
    const bulk = new Bulk();
    const {params} = this;
    bulk.setFrom(params.from!.email, params.from!.name);
    bulk.setSubject(params.subject!);
    bulk.setText(params.text_part!);
    bulk.setHtml(params.html_part!);
    if (params.attachments && params.attachments.length > 0) {
      params.attachments
        .forEach((attachment) => bulk.addAttachment(attachment!));
    }
    if (this.unsubscribe &&
      (this.unsubscribe.email || this.unsubscribe.url)) {
      bulk.setUnsubscribe({
        email: this.unsubscribe.email, url: this.unsubscribe.url,
      });
    }
    await bulk.register();
    params.to.map((to) => bulk.addTo(to.email, to.insert_code));
    await bulk.update();
    await bulk.send(sendTime);
    this.deliveryId = bulk.deliveryId;
    return true;
  }

  /**
   * Send the mail as Transaction.
   * @return {boolean} - The result of the send operation.
   */
  private async sendTransaction(): Promise<boolean> {
    const transaction = new Transaction();
    const {params} = this;
    transaction
      .setFrom(params.from!.email, this.params.from!.name);
    transaction.setTo(params.to[0].email, this.params.to[0].insert_code);
    transaction.setSubject(params.subject!);
    transaction.setEncode(params.encode!);
    transaction.setText(params.text_part!);
    transaction.setHtml(params.html_part!);
    if (params.cc && params.cc.length > 0) {
      params.cc.forEach((cc) => transaction.addCc(cc));
    }
    if (params.bcc && params.bcc.length > 0) {
      params.bcc.forEach((bcc) => transaction.addBcc(bcc));
    }
    if (this.unsubscribe &&
      (this.unsubscribe.email || this.unsubscribe.url)) {
      transaction.setUnsubscribe({
        email: this.unsubscribe.email, url: this.unsubscribe.url,
      });
    }
    if (params.attachments && params.attachments.length > 0) {
      params.attachments
        .forEach((attachment) => transaction.addAttachment(attachment!));
    }
    await transaction.send();
    this.deliveryId = transaction.deliveryId;
    return true;
  }
}

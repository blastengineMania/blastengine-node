import Base from "./base";
import Bulk from "./bulk";
import Transaction from "./transaction";
import { MailConfig, SearchCondition, SearchResult, Attachment } from "../../types/";
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
    params: MailConfig;
    /**
     * Creates a new instance (Bulk or Transaction) from a JSON object.
     *
     * @param {SearchResult} params - The JSON object.
     * @return {Bulk | Transaction} - The new Bulk or Transaction instance.
     * @static
     */
    static fromJson(params: SearchResult): Bulk | Transaction;
    /**
     * Finds mails based on conditions.
     *
     * @async
     * @param {SearchCondition} params - The search conditions.
     * @return {Promise<(Bulk | Transaction)[]>} - The search results.
     * @static
     */
    static find(params?: SearchCondition): Promise<(Bulk | Transaction)[]>;
    /**
     * Adds a recipient to the mail.
     *
     * @param {string} email - The email address.
     * @param {Object<string, string>} [insertCode] - The insert code.
     * @return {Mail} - The current instance.
     */
    addTo(email: string, insertCode?: {
        [key: string]: string;
    }): Mail;
    /**
     * Sets the encoding for the message.
     *
     * @param {string} encode - The character encoding.
     * @return {Mail} - The current instance.
     */
    setEncode(encode?: string): Mail;
    /**
     * Sets the sender for the message.
     *
     * @param {string} email - The email address.
     * @param {string} [name] - The name.
     * @return {Mail} - The current instance.
     */
    setFrom(email: string, name?: string): Mail;
    /**
     * Sets the subject for the message.
     *
     * @param {string} subject - The subject.
     * @return {Mail} - The current instance.
     */
    setSubject(subject: string): Mail;
    /**
     * Sets the text part for the message.
     *
     * @param {string} text - The text.
     * @return {Mail} - The current instance.
     */
    setText(text: string): Mail;
    /**
     * Sets the HTML part for the message.
     *
     * @param {string} html - The HTML.
     * @return {Mail} - The current instance.
     */
    setHtml(html: string): Mail;
    /**
     * Adds cc email to the mail.
     *
     * @param {string} email - The email address.
     * @return {Mail} - The current instance.
     */
    addCc(email: string): Mail;
    /**
     * Adds bcc email to the mail.
     *
     * @param {string} email - The email address.
     * @return {Mail} - The current instance.
     */
    addBcc(email: string): Mail;
    /**
     * Adds an attachment to the mail.
     *
     * @param {Attachment} file - The attachment.
     * @return {Mail} - The current instance.
     */
    addAttachment(file: Attachment): Mail;
    /**
     * Send the mail.
     * @param {Date} [sendTime] - The date and time to send the mail.
     * @return {MailConfig} - The prepared parameters.
     */
    send(sendTime?: Date): Promise<boolean>;
    /**
     * Send the mail as Bulk.
     * @param {Date} [sendTime] - The date and time to send the mail.
     * @return {boolean} - The result of the send operation.
     */
    private sendBulk;
    /**
     * Send the mail as Transaction.
     * @return {boolean} - The result of the send operation.
     */
    private sendTransaction;
}

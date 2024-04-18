import BEObject from "./object";
import Report from "./report";
import { Attachment, InsertCode, SuccessJsonFormat, Unsubscribed } from "../../types/";
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
    fromName: string;
    /**
     * The email address of the sender.
     * @type {string}
     */
    fromEmail: string;
    /**
     * The subject of the message.
     * @type {string}
     */
    subject: string;
    /**
     * The encoding of the message.
     * @type {string}
     */
    encode: string;
    /**
     * The text part of the message.
     * @type {string}
     */
    textPart: string;
    /**
     * The HTML part of the message.
     * @type {string}
     */
    htmlPart: string;
    /**
     * The URL of the message.
     * @type {string}
     */
    url?: string;
    /**
     * Information of unsubscribed
     */
    unsubscribe: Unsubscribed;
    /**
     * The attachments of the message.
     * @type {Attachment[]}
     */
    attachments: Attachment[];
    /**
     * The public file of the message.
     * @type {Attachment}
     */
    file?: Attachment;
    /**
     * The delivery type of the message.
     * @type {string}
     */
    deliveryType?: string;
    /**
     * The status of the message.
     * @type {string}
     */
    status?: string;
    /**
     * The total count of the message.
     * @type {number}
     */
    totalCount?: number;
    /**
     * The sent count of the message.
     * @type {number}
     */
    sentCount?: number;
    /**
     * The drop count of the message.
     * @type {number}
     */
    dropCount?: number;
    /**
     * The hard error count of the message.
     * @type {number}
     */
    hardErrorCount?: number;
    /**
     * The soft error count of the message.
     * @type {number}
     */
    softErrorCount?: number;
    /**
     * The open count of the message.
     * @type {number}
     */
    openCount?: number;
    /**
     * The delivery time of the message.
     * @type {Date}
     */
    deliveryTime?: Date;
    /**
     * The reservation time of the message.
     * @type {Date}
     */
    reservationTime?: Date;
    /**
     * The created time of the message.
     * @type {Date}
     */
    createdTime?: Date;
    /**
     * The updated time of the message.
     * @type {Date}
     */
    updatedTime?: Date;
    /**
     * Creates a new instance of Base.
     */
    constructor();
    /**
     * Sets a value to a specified property of this instance.
     *
     * @param {string} key - The name of the property.
     * @param {any} value - The value to be assigned.
     * @return {Base} - The current instance.
     */
    set(key: string, value: unknown): Base;
    /**
     * Sets the subject of the message.
     *
     * @param {string} subject - The subject text.
     * @return {BEReturnType} - The current instance.
     */
    setSubject(subject: string): Base;
    /**
     * Sets the sender's email and name.
     *
     * @param {string} email - The email address of the sender.
     * @param {string} [name=""] - The name of the sender.
     * @return {BEReturnType} - The current instance.
     */
    setFrom(email: string, name?: string): Base;
    /**
     * Sets the encoding for the message.
     *
     * @param {string} encode - The character encoding.
     * @return {Base} - The current instance.
     */
    setEncode(encode: string): Base;
    /**
     * Sets the text part of the message.
     *
     * @param {string} text - The text content.
     * @return {Base} - The current instance.
     */
    setText(text: string): Base;
    /**
     * Sets the HTML part of the message.
     *
     * @param {string} html - The HTML content.
     * @return {Base} - The current instance.
     */
    setHtml(html: string): Base;
    /**
     * Adds an attachment to the message.
     *
     * @param {Attachment} file - The file to be attached.
     * @return {Base} - The current instance.
     */
    addAttachment(file: Attachment): Base;
    /**
     * Set unsubscribe information
     *
     * @param {Unsubscribed} params - Information of unsubscribe.
     * @return {Base} - The current instance.
     */
    setUnsubscribe({ email, url }: Unsubscribed): Base;
    /**
     * Cancels the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessJsonFormat>} - The result of the cancel operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    cancel(): Promise<SuccessJsonFormat>;
    /**
     * Retrieves information about the delivery, based on the deliveryId.
     *
     * @async
     * @throws Will throw an error if deliveryId is not found.
     * @return {Promise<void>}
     */
    get(): Promise<void>;
    /**
     * Returns a new Report instance for the current delivery.
     *
     * @return {Report} - A new Report instance.
     */
    report(): Report;
    /**
     * Converts a hash object to an array of InsertCode objects.
     *
     * @param {Object<string, string>} [hash={}] - The hash object.
     * @return {InsertCode[]} - The array of InsertCode objects.
     */
    hashToInsertCode(hash?: {
        [key: string]: string;
    }): InsertCode[];
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Transaction from './transaction';
const object_1 = __importDefault(require("./object"));
const report_1 = __importDefault(require("./report"));
/**
 * The Base class extends BEObject and serves as a foundation for
 * handling various message attributes and operations in the context
 * of a message delivery system.
 *
 * @extends {BEObject}
 */
class Base extends object_1.default {
    /**
     * Creates a new instance of Base.
     */
    constructor() {
        super();
        /**
         * The name of the sender.
         * @type {string}
         */
        this.fromName = "";
        /**
         * The email address of the sender.
         * @type {string}
         */
        this.fromEmail = "";
        /**
         * The subject of the message.
         * @type {string}
         */
        this.subject = "";
        /**
         * The encoding of the message.
         * @type {string}
         */
        this.encode = "UTF-8";
        /**
         * The text part of the message.
         * @type {string}
         */
        this.textPart = "";
        /**
         * The HTML part of the message.
         * @type {string}
         */
        this.htmlPart = "";
        /**
         * The attachments of the message.
         * @type {Attachment[]}
         */
        this.attachments = [];
    }
    /**
     * Sets a value to a specified property of this instance.
     *
     * @param {string} key - The name of the property.
     * @param {any} value - The value to be assigned.
     * @return {Base} - The current instance.
     */
    set(key, value) {
        switch (key) {
            case "delivery_id":
                this.deliveryId = value;
                break;
            case "text_part":
                this.textPart = value;
                break;
            case "html_part":
                this.htmlPart = value;
                break;
            case "total_count":
                this.totalCount = value;
                break;
            case "sent_count":
                this.sentCount = value;
                break;
            case "drop_count":
                this.dropCount = value;
                break;
            case "hard_error_count":
                this.hardErrorCount = value;
                break;
            case "soft_error_count":
                this.softErrorCount = value;
                break;
            case "open_count":
                this.openCount = value;
                break;
            case "from": {
                const val = value;
                if (val.name) {
                    this.fromName = val.name;
                }
                if (val.email) {
                    this.fromEmail = val.email;
                }
                break;
            }
            case "subject":
                this.subject = value;
                break;
            case "status":
                this.status = value;
                break;
            case "delivery_time":
                if (value)
                    this.deliveryTime = new Date(value);
                break;
            case "reservation_time":
                if (value)
                    this.reservationTime = new Date(value);
                break;
            case "created_time":
                this.createdTime = new Date(value);
                break;
            case "updated_time":
                this.updatedTime = new Date(value);
                break;
            case "delivery_type":
                this.deliveryType = value;
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
    setSubject(subject) {
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
    setFrom(email, name = "") {
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
    setEncode(encode) {
        this.encode = encode;
        return this;
    }
    /**
     * Sets the text part of the message.
     *
     * @param {string} text - The text content.
     * @return {Base} - The current instance.
     */
    setText(text) {
        this.textPart = text;
        return this;
    }
    /**
     * Sets the HTML part of the message.
     *
     * @param {string} html - The HTML content.
     * @return {Base} - The current instance.
     */
    setHtml(html) {
        this.htmlPart = html;
        return this;
    }
    /**
     * Adds an attachment to the message.
     *
     * @param {Attachment} file - The file to be attached.
     * @return {BEReturnType} - The current instance.
     */
    addAttachment(file) {
        this.attachments.push(file);
        return this;
    }
    /**
     * Retrieves information about the delivery, based on the deliveryId.
     *
     * @async
     * @throws Will throw an error if deliveryId is not found.
     * @return {Promise<void>}
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw new Error("Delivery id is not found.");
            const url = `/deliveries/${this.deliveryId}`;
            const res = yield Base.request.send("get", url);
            this.sets(res);
        });
    }
    /**
     * Returns a new Report instance for the current delivery.
     *
     * @return {Report} - A new Report instance.
     */
    report() {
        return new report_1.default(this.deliveryId);
    }
    /**
     * Converts a hash object to an array of InsertCode objects.
     *
     * @param {Object<string, string>} [hash={}] - The hash object.
     * @return {InsertCode[]} - The array of InsertCode objects.
     */
    hashToInsertCode(hash) {
        if (!hash)
            return [];
        return Object.keys(hash).map((key) => {
            return {
                key: `__${key}__`,
                value: hash[key],
            };
        });
    }
}
exports.default = Base;

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
const base_1 = __importDefault(require("./base"));
const bulk_1 = __importDefault(require("./bulk"));
const transaction_1 = __importDefault(require("./transaction"));
/**
 * Class representing a mail, extending the Base class.
 * Provides methods to set mail properties,
 * create a mail instance from JSON, and find mails based on conditions.
 *
 * @extends {Base}
 */
class Mail extends base_1.default {
    constructor() {
        super(...arguments);
        /**
         * Configuration parameters for mail.
         * @type {MailConfig}
         */
        this.params = {
            to: [],
            cc: [],
            bcc: [],
            text_part: undefined,
            html_part: undefined,
            from: undefined,
            encode: "utf-8",
            attachments: [],
        };
    }
    /**
     * Creates a new instance (Bulk or Transaction) from a JSON object.
     *
     * @param {SearchResult} params - The JSON object.
     * @return {Bulk | Transaction} - The new Bulk or Transaction instance.
     * @static
     */
    static fromJson(params) {
        const obj = params.delivery_type === "TRANSACTION" ?
            new transaction_1.default() :
            new bulk_1.default();
        obj.sets(params);
        return obj;
    }
    /**
     * Finds mails based on conditions.
     *
     * @async
     * @param {SearchCondition} params - The search conditions.
     * @return {Promise<(Bulk | Transaction)[]>} - The search results.
     * @static
     */
    static find(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((params === null || params === void 0 ? void 0 : params.delivery_start) && params.delivery_start instanceof Date) {
                params.delivery_start = params.delivery_start.toISOString();
            }
            if ((params === null || params === void 0 ? void 0 : params.delivery_end) && params.delivery_end instanceof Date) {
                params.delivery_end = params.delivery_end.toISOString();
            }
            const url = "/deliveries";
            const res = yield Mail.request.send("get", url, params);
            return res.data.map((params) => Mail.fromJson(params));
        });
    }
    /**
     * Adds a recipient to the mail.
     *
     * @param {string} email - The email address.
     * @param {Object<string, string>} [insertCode] - The insert code.
     * @return {Mail} - The current instance.
     */
    addTo(email, insertCode) {
        Object.keys(insertCode || {}).forEach((key) => {
            if (key.length > 16) {
                throw new Error("Insert code key is limited to 16.");
            }
            if (key.length < 1) {
                throw new Error("Insert code key is required at least 1.");
            }
        });
        this.params.to.push({ email, insert_code: insertCode });
        return this;
    }
    /**
     * Sets the encoding for the message.
     *
     * @param {string} encode - The character encoding.
     * @return {Mail} - The current instance.
     */
    setEncode(encode = "utf-8") {
        if (encode.trim() === "")
            throw new Error("Encode is required.");
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
    setFrom(email, name = "") {
        if (!email || email.trim() === "")
            throw new Error("Email is required.");
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
    setSubject(subject) {
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
    setText(text) {
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
    setHtml(html) {
        if (!html || html.trim() === "")
            throw new Error("Html is required.");
        this.params.html_part = html;
        return this;
    }
    /**
     * Adds cc email to the mail.
     *
     * @param {string} email - The email address.
     * @return {Mail} - The current instance.
     */
    addCc(email) {
        if (!email || email.trim() === "")
            throw new Error("Email is required.");
        if (!this.params.cc)
            this.params.cc = [];
        this.params.cc.push(email);
        return this;
    }
    /**
     * Adds bcc email to the mail.
     *
     * @param {string} email - The email address.
     * @return {Mail} - The current instance.
     */
    addBcc(email) {
        if (!email || email.trim() === "")
            throw new Error("Email is required.");
        if (!this.params.bcc)
            this.params.bcc = [];
        this.params.bcc.push(email);
        return this;
    }
    /**
     * Adds an attachment to the mail.
     *
     * @param {Attachment} file - The attachment.
     * @return {Mail} - The current instance.
     */
    addAttachment(file) {
        if (!file)
            throw new Error("File is required.");
        if (!this.params.attachments)
            this.params.attachments = [];
        this.params.attachments.push(file);
        return this;
    }
    /**
     * Send the mail.
     * @param {Date} [sendTime] - The date and time to send the mail.
     * @return {MailConfig} - The prepared parameters.
     */
    send(sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // CCまたはBCCがある場合はTransaction × Toの分
            // Toが複数の場合はBulk、Toが1つの場合はTransaction
            if ((this.params.cc && this.params.cc.length > 0) ||
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
        });
    }
    /**
     * Send the mail as Bulk.
     * @param {Date} [sendTime] - The date and time to send the mail.
     * @return {boolean} - The result of the send operation.
     */
    sendBulk(sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulk = new bulk_1.default();
            const { params } = this;
            bulk.setFrom(params.from.email, params.from.name);
            bulk.setSubject(params.subject);
            bulk.setText(params.text_part);
            bulk.setHtml(params.html_part);
            if (params.attachments && params.attachments.length > 0) {
                params.attachments
                    .forEach((attachment) => bulk.addAttachment(attachment));
            }
            yield bulk.register();
            params.to.map((to) => bulk.addTo(to.email, to.insert_code));
            yield bulk.update();
            yield bulk.send(sendTime);
            this.deliveryId = bulk.deliveryId;
            return true;
        });
    }
    /**
     * Send the mail as Transaction.
     * @return {boolean} - The result of the send operation.
     */
    sendTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = new transaction_1.default();
            const { params } = this;
            transaction
                .setFrom(params.from.email, this.params.from.name);
            transaction.setTo(params.to[0].email, this.params.to[0].insert_code);
            transaction.setSubject(params.subject);
            transaction.setEncode(params.encode);
            transaction.setText(params.text_part);
            transaction.setHtml(params.html_part);
            if (params.cc && params.cc.length > 0) {
                params.cc.forEach((cc) => transaction.addCc(cc));
            }
            if (params.bcc && params.bcc.length > 0) {
                params.bcc.forEach((bcc) => transaction.addBcc(bcc));
            }
            if (params.attachments && params.attachments.length > 0) {
                params.attachments
                    .forEach((attachment) => transaction.addAttachment(attachment));
            }
            yield transaction.send();
            this.deliveryId = transaction.deliveryId;
            return true;
        });
    }
}
exports.default = Mail;

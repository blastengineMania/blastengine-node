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
/**
 * Class representing a transaction operation, extending the Base class.
 * Provides methods to send transaction deliveries.
 *
 * @extends {Base}
 */
class Transaction extends base_1.default {
    constructor() {
        super(...arguments);
        /**
         * The email address of the sender.
         * @type {string}
         */
        this.to = "";
        /**
         * The email address of the sender as Cc.
         * @type {string[]}
         */
        this.cc = [];
        /**
         * The email address of the sender as Bcc.
         * @type {string[]}
         */
        this.bcc = [];
        /**
         * Replace the insert code in the email.
         * @type {{key: string, value: string}[]}
         */
        this.insert_code = [];
    }
    /**
     * Set a recipient to the transaction delivery.
     *
     * @param {string} email - The email address of the recipient.
     * @param {InsertCode} insertCode - The insert code for the recipient.
     * @return {BEReturnType} - The current instance.
     */
    setTo(email, insertCode) {
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
    addCc(email) {
        if (this.cc.length >= 10)
            throw new Error("Cc is limited to 10.");
        this.cc.push(email);
        return this;
    }
    /**
     * Add a recipient to the transaction delivery as Bcc.
     *
     * @param {string} email - The email address of the recipient.
     * @return {BEReturnType} - The current instance.
     */
    addBcc(email) {
        if (this.bcc.length >= 10)
            throw new Error("Bcc is limited to 10.");
        this.bcc.push(email);
        return this;
    }
    /**
     * Prepares the parameters for sending the transaction delivery.
     *
     * @return {RequestParamsTransaction} - The prepared parameters.
     */
    params() {
        const params = {
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
        return params;
    }
    /**
     * Sends the transaction delivery.
     *
     * @async
     * @return {Promise<SuccessJsonFormat>} - The success message.
     */
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "/deliveries/transaction";
            const res = yield Transaction.request
                .send("post", url, this.params());
            this.deliveryId = res.delivery_id;
            return res;
        });
    }
}
exports.default = Transaction;

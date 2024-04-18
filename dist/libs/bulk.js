"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const date_fns_tz_1 = require("date-fns-tz");
const job_1 = __importDefault(require("./job"));
const email_1 = __importDefault(require("./email"));
const tmp_promise_1 = require("tmp-promise");
const fs = __importStar(require("fs"));
const util_1 = require("util");
/**
 * Class representing a bulk operation, extending the Base class.
 * Provides methods to register, update, and send bulk deliveries.
 *
 * @extends {Base}
 */
class Bulk extends base_1.default {
    constructor() {
        super(...arguments);
        /**
         * An array to hold bulk update information.
         * @type {BulkUpdateTo[]}
         */
        this.to = [];
    }
    /**
     * Registers a new bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the registration.
     */
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "/deliveries/bulk/begin";
            const res = yield Bulk.request
                .send("post", url, this.saveParams());
            this.deliveryId = res.delivery_id;
            return res;
        });
    }
    /**
     * Imports a file for bulk update.
     *
     * @async
     * @param {Attachment} filePath - The path of the file to import.
     * @return {Promise<Job>} - A Job instance representing the import job.
     * @throws Will throw an error if deliveryId is not found.
     */
    import(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw new Error("Delivery id is not found.");
            const url = `/deliveries/${this.deliveryId}/emails/import`;
            const res = yield Bulk.request.send("post", url, {
                file: filePath,
            });
            return new job_1.default(res.job_id);
        });
    }
    /**
     * Updates the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the update.
     * @throws Will throw an error if deliveryId is not found.
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw new Error("Delivery id is not found.");
            const params = this.updateParams();
            if (params.to && params.to.length > 50) {
                const csv = this.createCsv(params.to);
                const { path } = yield (0, tmp_promise_1.file)({ postfix: ".csv" });
                yield (0, util_1.promisify)(fs.writeFile)(path, csv);
                const job = yield this.import(path);
                while (job.finished() === false) {
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                }
                delete params.to;
            }
            const url = `/deliveries/bulk/update/${this.deliveryId}`;
            const res = yield Bulk.request
                .send("put", url, params);
            return res;
        });
    }
    /**
     * Creates a CSV string from the provided data.
     *
     * @param {BulkUpdateTo[]} to - The data to convert to CSV.
     * @return {string} - The CSV string.
     */
    createCsv(to) {
        var _a, _b;
        // ヘッダーを作る
        const headers = ["email"];
        for (const t of to) {
            const params = ((_a = t.insert_code) === null || _a === void 0 ? void 0 : _a.map((c) => c.key)) || [];
            for (const p of params) {
                if (!headers.includes(p))
                    headers.push(p);
            }
        }
        const lines = [`"${headers.join("\",\"")}"`];
        for (const t of to) {
            // const params = t.insert_code?.map((c) => c.key) || [];
            const values = [t.email];
            for (const h of headers) {
                if (h === "email")
                    continue;
                const code = (_b = t.insert_code) === null || _b === void 0 ? void 0 : _b.find((c) => c.key === h);
                values.push(code ? code.value.replace("\"", "\"\"") : "");
            }
            lines.push(`"${values.join("\",\"")}"`);
        }
        return lines.join("\n");
    }
    /**
     * Sends the bulk delivery.
     *
     * @async
     * @param {Date} [date] - The date to send the delivery.
     * @return {Promise<SuccessJsonFormat>} - The result of the send operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    send(date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw new Error("Delivery id is not found.");
            const url = date ?
                `/deliveries/bulk/commit/${this.deliveryId}` :
                `/deliveries/bulk/commit/${this.deliveryId}/immediate`;
            const res = yield Bulk.request
                .send("patch", url, this.commitParams(date));
            return res;
        });
    }
    /**
     * Deletes the bulk delivery.
     *
     * @async
     * @return {Promise<SuccessFormat>} - The result of the delete operation.
     * @throws Will throw an error if deliveryId is not found.
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw new Error("Delivery id is not found.");
            const url = `/deliveries/${this.deliveryId}`;
            const res = yield Bulk.request
                .send("delete", url);
            return res;
        });
    }
    /**
     * Gets an Email instance for the current bulk delivery.
     *
     * @return {Email} - The Email instance.
     * @throws Will throw an error if deliveryId is not found.
     */
    email() {
        if (!this.deliveryId)
            throw new Error("Delivery id is not found.");
        return new email_1.default(this.deliveryId);
    }
    /**
     * Adds a recipient to the bulk delivery.
     *
     * @param {string} email - The email address of the recipient.
     * @param {InsertCode} insertCode - The insert code for the recipient.
     * @return {Bulk} - The current instance.
     */
    addTo(email, insertCode) {
        const params = { email };
        params.insert_code = this.hashToInsertCode(insertCode);
        this.to.push(params);
        return this;
    }
    /**
     * Prepares the parameters for saving the bulk delivery.
     *
     * @return {RequestParamsBulkBegin} - The prepared parameters.
     */
    saveParams() {
        const params = {
            from: {
                email: this.fromEmail,
                name: this.fromName,
            },
            subject: this.subject,
            encode: this.encode,
            text_part: this.textPart,
            html_part: this.htmlPart,
        };
        if (this.unsubscribe) {
            params.list_unsubscribe = {};
            if (this.unsubscribe.email) {
                params.list_unsubscribe.mailto = `mailto:${this.unsubscribe.email}`;
            }
            if (this.unsubscribe.url) {
                params.list_unsubscribe.url = this.unsubscribe.url;
            }
        }
        if (this.attachments.length > 0) {
            params.attachments = this.attachments;
        }
        return params;
    }
    /**
     * Prepares the parameters for updating the bulk delivery.
     *
     * @return {RequestParamsBulkUpdate} - The prepared parameters.
     */
    updateParams() {
        const params = {
            from: {
                email: this.fromEmail,
                name: this.fromName,
            },
            subject: this.subject,
            to: this.to,
            text_part: this.textPart,
            html_part: this.htmlPart,
        };
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
     * Prepares the parameters for committing the bulk delivery.
     *
     * @param {Date} [date] - The date to commit the delivery.
     * @return {RequestParamsBulkCommit} - The prepared parameters.
     */
    commitParams(date) {
        if (!date)
            return {};
        const reservationTime = (0, date_fns_tz_1.format)(date, "yyyy-MM-dd'T'HH:mm:ssXXX", {
            timeZone: "Asia/Tokyo",
        })
            .replace("+0900", "+09:00");
        return {
            reservation_time: reservationTime,
        };
    }
}
exports.default = Bulk;

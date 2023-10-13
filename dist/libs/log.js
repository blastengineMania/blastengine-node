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
const object_1 = __importDefault(require("./object"));
const qs_1 = __importDefault(require("qs"));
/**
 * Class representing a log, extending the BEObject class.
 * Provides methods to set log properties,
 * create a log instance from JSON, and find logs based on conditions.
 *
 * @extends {BEObject}
 */
class Log extends object_1.default {
    /**
     * Creates a new Log instance from a JSON object.
     *
     * @param {SearchLogResult} params - The JSON object.
     * @return {Log} - The new Log instance.
     */
    static fromJson(params) {
        const obj = new Log;
        obj.sets(params);
        return obj;
    }
    /**
     * Sets a property value on the Log instance.
     *
     * @param {string} key - The property key.
     * @param {unknown} value - The property value.
     * @return {Log} - The current Log instance.
     */
    set(key, value) {
        switch (key) {
            case "delivery_id":
                this.deliveryId = value;
                break;
            case "delivery_type":
                this.deliveryType = value;
                break;
            case "status":
                this.status = value;
                break;
            case "delivery_time":
                if (value)
                    this.deliveryTime = new Date(value);
                break;
            case "last_response_code":
                this.lastResponseCode = value;
                break;
            case "last_response_message":
                this.lastResponseMessage = value;
                break;
            case "open_time":
                if (value)
                    this.openTime = new Date(value);
                break;
            case "created_time":
                if (value)
                    this.createdTime = new Date(value);
                break;
            case "updated_time":
                if (value)
                    this.updatedTime = new Date(value);
                break;
            case "maillog_id":
                this.maillogId = value;
                break;
            case "email":
                this.email = value;
                break;
        }
        return this;
    }
    /**
     * Finds logs based on specified conditions.
     *
     * @param {SearchLogCondition} [params] - The search conditions.
     * @return {Promise<Log[]>} - A promise that resolves
     * to an array of Log instances.
     * @static
     * @async
     */
    static find(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((params === null || params === void 0 ? void 0 : params.delivery_start) && params.delivery_start instanceof Date) {
                params.delivery_start = params.delivery_start.toISOString();
            }
            if ((params === null || params === void 0 ? void 0 : params.delivery_end) && params.delivery_end instanceof Date) {
                params.delivery_end = params.delivery_end.toISOString();
            }
            const query = params ?
                qs_1.default.stringify(params).replace(/%5B[0-9]?%5D/g, "%5B%5D") :
                "";
            const url = `/logs/mails/results?${query}`;
            const res = yield Log.request.send("get", url);
            return res.data.map((params) => Log.fromJson(params));
        });
    }
}
exports.default = Log;

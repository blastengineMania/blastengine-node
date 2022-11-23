"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usage = exports.Transaction = exports.Bulk = exports.BlastEngine = void 0;
const crypto_1 = __importDefault(require("crypto"));
const transaction_1 = __importDefault(require("./libs/transaction"));
exports.Transaction = transaction_1.default;
const bulk_1 = __importDefault(require("./libs/bulk"));
exports.Bulk = bulk_1.default;
const usage_1 = __importDefault(require("./libs/usage"));
exports.Usage = usage_1.default;
const request_1 = __importDefault(require("./libs/request"));
const object_1 = __importDefault(require("./libs/object"));
class BlastEngine {
    constructor(userId, apiKey) {
        this.userId = userId;
        this.apiKey = apiKey;
        this.generateToken();
        const request = new request_1.default(this.token);
        object_1.default.request = request;
    }
    generateToken() {
        if (!this.userId)
            throw 'There is no userId';
        if (!this.apiKey)
            throw 'There is no apiKey';
        const str = `${this.userId}${this.apiKey}`;
        const hashHex = crypto_1.default
            .createHash('sha256')
            .update(str, 'utf8')
            .digest('hex');
        this.token = Buffer
            .from(hashHex.toLowerCase())
            .toString('base64');
    }
}
exports.BlastEngine = BlastEngine;

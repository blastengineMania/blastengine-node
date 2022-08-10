"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usage = exports.Transaction = exports.Bulk = exports.BlastEngine = void 0;
const crypto_1 = __importDefault(require("crypto"));
const transaction_1 = __importDefault(require("./libs/delivery/transaction"));
exports.Transaction = transaction_1.default;
const bulk_1 = __importDefault(require("./libs/delivery/transaction/bulk"));
exports.Bulk = bulk_1.default;
const base_1 = __importDefault(require("./libs/delivery/transaction/base"));
const job_1 = __importDefault(require("./libs/delivery/transaction/bulk/job"));
const usage_1 = __importDefault(require("./libs/usage"));
exports.Usage = usage_1.default;
const request_1 = __importDefault(require("./libs/request"));
class BlastEngine {
    constructor(userId, apiKey) {
        this.userId = userId;
        this.apiKey = apiKey;
        this.generateToken();
        const request = new request_1.default(this.token);
        base_1.default.request = request;
        job_1.default.request = request;
        usage_1.default.request = request;
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

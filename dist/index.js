"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const delivery_1 = __importDefault(require("./libs/delivery/"));
const bulk_1 = __importDefault(require("./libs/delivery/transaction/bulk"));
class Client {
    constructor(userId, apiKey) {
        this.userId = '';
        this.apiKey = '';
        this.token = '';
        this.userId = userId;
        this.apiKey = apiKey;
        this.generateToken();
        delivery_1.default.client = this;
        bulk_1.default.client = this;
        this.Delivery = new delivery_1.default;
        this.Bulk = new bulk_1.default;
    }
    bluk() {
        return new bulk_1.default;
    }
    generateToken() {
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
exports.default = Client;

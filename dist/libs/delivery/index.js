"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = __importDefault(require("./transaction"));
class Delivery {
    constructor() {
        transaction_1.default.client = Delivery.client;
    }
    transaction() {
        return new transaction_1.default;
    }
}
exports.default = Delivery;

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
class Transaction extends base_1.default {
    constructor() {
        super(...arguments);
        this.to = '';
        this.url = 'https://app.engn.jp/api/v1/deliveries/transaction';
    }
    setTo(email) {
        if (Array.isArray(email)) {
            email = email.join(',');
        }
        this.to = email;
        return this;
    }
    params() {
        return {
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            to: this.to,
            subject: this.subject,
            encode: this.encode,
            text_part: this.text_part,
            html_part: this.html_part,
        };
    }
    send(url, requestParams) {
        const _super = Object.create(null, {
            req: { get: () => super.req }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.req.call(this, 'post', this.url, this.params());
        });
    }
}
exports.default = Transaction;

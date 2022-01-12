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
const superagent_1 = __importDefault(require("superagent"));
class Transaction {
    constructor() {
        this.fromName = '';
        this.fromEmail = '';
        this.to = '';
        this.subject = '';
        this.encode = 'UTF-8';
        this.text_part = '';
        this.html_part = '';
        this.url = 'https://app.engn.jp/api/v1/deliveries/transaction';
    }
    setSubject(subject) {
        this.subject = subject;
        return this;
    }
    setFrom(email, name = '') {
        this.fromEmail = email;
        this.fromName = name;
        return this;
    }
    setTo(email) {
        if (Array.isArray(email)) {
            email = email.join(',');
        }
        this.to = email;
        return this;
    }
    setEncode(encode) {
        this.encode = encode;
        return this;
    }
    setText(text) {
        this.text_part = text;
        return this;
    }
    setHtml(html) {
        this.html_part = html;
        return this;
    }
    send() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
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
            const res = yield superagent_1.default
                .post(this.url)
                .send(params)
                .set('Authorization', `Bearer ${(_a = Transaction.client) === null || _a === void 0 ? void 0 : _a.token}`)
                .set('Content-Type', 'application/json');
            return res.body;
        });
    }
}
exports.default = Transaction;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class Mail extends base_1.default {
    constructor() {
        super(...arguments);
        this.params = {
            to: [],
            text_part: undefined,
            html_part: undefined,
            from: undefined,
            encode: 'utf-8',
            attachments: [],
        };
    }
    addTo(to) {
        this.params.to.push(to);
        return this;
    }
    setFrom(email, name = '') {
        this.params.from = {
            email,
            name,
        };
        return this;
    }
    setSubject(subject) {
        this.params.subject = subject;
        return this;
    }
    setText(text) {
        this.params.text_part = text;
        return this;
    }
    setHtml(html) {
        this.params.html_part = html;
        return this;
    }
    addCc(email) {
        if (!this.params.cc)
            this.params.cc = [];
        this.params.cc.push(email);
        return this;
    }
    addBcc(email) {
        if (!this.params.bcc)
            this.params.bcc = [];
        this.params.bcc.push(email);
        return this;
    }
}
exports.default = Mail;

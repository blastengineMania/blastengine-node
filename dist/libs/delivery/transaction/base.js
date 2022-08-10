"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = __importDefault(require("../../object"));
class Base extends object_1.default {
    constructor() {
        super();
        this.fromName = '';
        this.fromEmail = '';
        this.subject = '';
        this.encode = 'UTF-8';
        this.text_part = '';
        this.html_part = '';
        this.attachments = [];
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
    addAttachment(file) {
        this.attachments.push(file);
        return this;
    }
}
exports.default = Base;

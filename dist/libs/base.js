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
const transaction_1 = __importDefault(require("./transaction"));
const object_1 = __importDefault(require("./object"));
const report_1 = __importDefault(require("./report"));
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
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.delivery_id}`;
            const res = yield transaction_1.default.request.send('get', url);
            this.delivery_id = res.delivery_id;
            this.fromEmail = res.from.email;
            this.fromName = res.from.name;
            this.subject = res.subject;
            this.text_part = res.text_part;
            this.html_part = res.html_part;
            this.total_count = res.total_count;
            this.sent_count = res.sent_count;
            this.drop_count = res.drop_count;
            this.hard_error_count = res.hard_error_count;
            this.soft_error_count = res.soft_error_count;
            this.open_count = res.open_count;
            this.delivery_time = res.delivery_time ? new Date(res.delivery_time) : undefined;
            this.reservation_time = res.reservation_time ? new Date(res.reservation_time) : undefined;
            this.created_time = new Date(res.created_time);
            this.updated_time = new Date(res.updated_time);
            this.status = res.status;
            this.delivery_type = res.delivery_type;
        });
    }
    report() {
        return new report_1.default(this.delivery_id);
    }
}
exports.default = Base;

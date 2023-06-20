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
const bulk_1 = __importDefault(require("./bulk"));
const transaction_1 = __importDefault(require("./transaction"));
const qs_1 = __importDefault(require("qs"));
class Mail extends base_1.default {
    constructor() {
        super(...arguments);
        this.params = {
            to: [],
            cc: [],
            bcc: [],
            text_part: undefined,
            html_part: undefined,
            from: undefined,
            encode: 'utf-8',
            attachments: [],
        };
    }
    static fromJson(params) {
        const obj = params.delivery_type === 'TRANSACTION' ? new transaction_1.default() : new bulk_1.default();
        obj.sets(params);
        return obj;
    }
    static find(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((params === null || params === void 0 ? void 0 : params.delivery_start) && params.delivery_start instanceof Date)
                params.delivery_start = params.delivery_start.toISOString();
            if ((params === null || params === void 0 ? void 0 : params.delivery_end) && params.delivery_end instanceof Date)
                params.delivery_end = params.delivery_end.toISOString();
            const url = `/deliveries?${params ? qs_1.default.stringify(params).replace(/%5B[0-9]?%5D/g, '%5B%5D') : ''}`;
            const res = yield Mail.request.send('get', url);
            return res.data.map(params => Mail.fromJson(params));
        });
    }
    addTo(email, insert_code) {
        Object.keys(insert_code || {}).forEach(key => {
            if (key.length > 20)
                throw new Error('Insert code key is limited to 20.');
            if (key.length < 5)
                throw new Error('Insert code key is required at least 5.');
        });
        this.params.to.push({ email, insert_code });
        return this;
    }
    setEncode(encode = 'utf-8') {
        if (encode.trim() === '')
            throw new Error('Encode is required.');
        this.params.encode = encode;
        return this;
    }
    setFrom(email, name = '') {
        if (!email || email.trim() === '')
            throw new Error('Email is required.');
        this.params.from = {
            email,
            name,
        };
        return this;
    }
    setSubject(subject) {
        if (!subject || subject.trim() === '')
            throw new Error('Subject is required.');
        this.params.subject = subject;
        return this;
    }
    setText(text) {
        if (!text || text.trim() === '')
            throw new Error('Text is required.');
        this.params.text_part = text;
        return this;
    }
    setHtml(html) {
        if (!html || html.trim() === '')
            throw new Error('Html is required.');
        this.params.html_part = html;
        return this;
    }
    addCc(email) {
        if (!email || email.trim() === '')
            throw new Error('Email is required.');
        if (!this.params.cc)
            this.params.cc = [];
        this.params.cc.push(email);
        return this;
    }
    addBcc(email) {
        if (!email || email.trim() === '')
            throw new Error('Email is required.');
        if (!this.params.bcc)
            this.params.bcc = [];
        this.params.bcc.push(email);
        return this;
    }
    addAttachment(file) {
        if (!file)
            throw new Error('File is required.');
        if (!this.params.attachments)
            this.params.attachments = [];
        this.params.attachments.push(file);
        return this;
    }
    send(sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // CCまたはBCCがある場合はTransaction × Toの分
            // Toが複数の場合はBulk、Toが1つの場合はTransaction
            if ((this.params.cc && this.params.cc.length > 0) || (this.params.bcc && this.params.bcc.length > 0)) {
                // CCまたはBCCがある場合は、指定時刻送信はできない
                if (sendTime)
                    throw new Error('CC or BCC is not supported when sending at a specified time.');
                if (this.params.to.length > 1)
                    throw new Error('CC or BCC is not supported when sending to multiple recipients.');
            }
            if (sendTime || this.params.to.length > 1) {
                return this.sendBulk(sendTime);
            }
            return this.sendTransaction();
        });
    }
    sendBulk(sendTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const bulk = new bulk_1.default();
            const { params } = this;
            bulk
                .setFrom(params.from.email, params.from.name)
                .setSubject(params.subject)
                .setText(params.text_part)
                .setHtml(params.html_part);
            if (params.attachments && params.attachments.length > 0) {
                params.attachments.forEach(attachment => bulk.addAttachment(attachment));
            }
            yield bulk.register();
            params.to.map(to => bulk.addTo(to.email, to.insert_code));
            yield bulk.update();
            yield bulk.send(sendTime);
            this.deliveryId = bulk.deliveryId;
            return true;
        });
    }
    sendTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = new transaction_1.default();
            const { params } = this;
            transaction
                .setFrom(params.from.email, this.params.from.name)
                .setTo(params.to[0].email, this.params.to[0].insert_code)
                .setSubject(params.subject)
                .setEncode(params.encode)
                .setText(params.text_part)
                .setHtml(params.html_part);
            if (params.cc && params.cc.length > 0) {
                params.cc.forEach(cc => transaction.addCc(cc));
            }
            if (params.bcc && params.bcc.length > 0) {
                params.bcc.forEach(bcc => transaction.addBcc(bcc));
            }
            if (params.attachments && params.attachments.length > 0) {
                params.attachments.forEach(attachment => transaction.addAttachment(attachment));
            }
            yield transaction.send();
            this.deliveryId = transaction.deliveryId;
            return true;
        });
    }
}
exports.default = Mail;

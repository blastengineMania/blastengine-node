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
// import Transaction from './transaction';
const object_1 = __importDefault(require("./object"));
const report_1 = __importDefault(require("./report"));
class Base extends object_1.default {
    constructor() {
        super();
        this.fromName = '';
        this.fromEmail = '';
        this.subject = '';
        this.encode = 'UTF-8';
        this.textPart = '';
        this.htmlPart = '';
        this.attachments = [];
    }
    set(key, value) {
        switch (key) {
            case 'delivery_id':
                this.deliveryId = value;
                break;
            case 'text_part':
                this.textPart = value;
                break;
            case 'html_part':
                this.htmlPart = value;
                break;
            case 'total_count':
                this.totalCount = value;
                break;
            case 'sent_count':
                this.sentCount = value;
                break;
            case 'drop_count':
                this.dropCount = value;
                break;
            case 'hard_error_count':
                this.hardErrorCount = value;
                break;
            case 'soft_error_count':
                this.softErrorCount = value;
                break;
            case 'open_count':
                this.openCount = value;
                break;
            case 'from':
                if (value.name)
                    this.fromName = value.name;
                if (value.email)
                    this.fromEmail = value.email;
                break;
            case 'subject':
                this.subject = value;
                break;
            case 'status':
                this.status = value;
                break;
            case 'delivery_time':
                if (value)
                    this.deliveryTime = new Date(value);
                break;
            case 'reservation_time':
                if (value)
                    this.reservationTime = new Date(value);
                break;
            case 'created_time':
                this.createdTime = new Date(value);
                break;
            case 'updated_time':
                this.updatedTime = new Date(value);
                break;
            case 'delivery_type':
                this.deliveryType = value;
                break;
        }
        return this;
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
        this.textPart = text;
        return this;
    }
    setHtml(html) {
        this.htmlPart = html;
        return this;
    }
    addAttachment(file) {
        this.attachments.push(file);
        return this;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.deliveryId}`;
            const res = yield Base.request.send('get', url);
            this.sets(res);
        });
    }
    report() {
        return new report_1.default(this.deliveryId);
    }
    hashToInsertCode(hash) {
        if (!hash)
            return [];
        return Object.keys(hash).map(key => {
            return {
                key: `__${key}__`,
                value: hash[key],
            };
        });
    }
}
exports.default = Base;

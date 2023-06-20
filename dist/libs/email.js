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
const object_1 = __importDefault(require("./object"));
class Email extends object_1.default {
    constructor(delivery_id) {
        super();
        this.insertCode = {};
        this.deliveryId = delivery_id;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailId)
                throw 'Email id is not found.';
            const url = `/deliveries/-/emails/${this.emailId}`;
            const res = yield Email.request.send('get', url);
            res.insert_code.forEach(params => {
                this.insertCode[params.key.replace(/__/, '')] = params.value;
            });
            this.address = res.email;
            this.createdTime = new Date(res.created_time);
            this.updatedTime = new Date(res.updated_time);
            return this.emailId;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailId) {
                return this.create();
            }
            else {
                return this.update();
            }
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.deliveryId)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.deliveryId}/emails`;
            const res = yield Email.request.send('post', url, this.getParams());
            this.emailId = res.email_id;
            return this.emailId;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailId)
                throw 'Email id is not found.';
            const url = `/deliveries/-/emails/${this.emailId}`;
            const res = yield Email.request.send('put', url, this.getParams());
            return this.emailId;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailId)
                throw 'Email id is not found.';
            const url = `/deliveries/-/emails/${this.emailId}`;
            const res = yield Email.request.send('delete', url);
            return true;
        });
    }
    getParams() {
        return {
            email: this.address,
            insert_code: Object.keys(this.insertCode).map(key => {
                return { key: `__${key}__`, value: this.insertCode[key] };
            }),
        };
    }
}
exports.default = Email;

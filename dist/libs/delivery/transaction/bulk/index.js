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
const base_1 = __importDefault(require("../base"));
const strftime_1 = __importDefault(require("strftime"));
class Bulk extends base_1.default {
    constructor() {
        super(...arguments);
        this.to = [];
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://app.engn.jp/api/v1/deliveries/bulk/begin';
            const res = yield this.req('post', url, this.saveParams());
            this.delivery_id = res.delivery_id;
            return res;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `https://app.engn.jp/api/v1/deliveries/bulk/update/${this.delivery_id}`;
            const res = yield this.req('put', url, this.updateParams());
            return res;
        });
    }
    send(date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!date) {
                date = new Date;
                date.setMinutes(date.getMinutes() + 1);
            }
            this.date = date;
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `https://app.engn.jp/api/v1/deliveries/bulk/commit/${this.delivery_id}`;
            const res = yield this.req('patch', url, this.commitParams());
            return res;
        });
    }
    setTo(email, insertCode) {
        const params = { email };
        if (insertCode) {
            if (Array.isArray(insertCode)) {
                params.insert_code = insertCode;
            }
            else {
                params.insert_code = [insertCode];
            }
        }
        this.to.push(params);
        return this;
    }
    saveParams() {
        return {
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            subject: this.subject,
            encode: this.encode,
            text_part: this.text_part,
            html_part: this.html_part,
        };
    }
    updateParams() {
        return {
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            subject: this.subject,
            to: this.to,
            text_part: this.text_part,
            html_part: this.html_part,
        };
    }
    commitParams() {
        strftime_1.default.timezone(9 * 60);
        return {
            reservation_time: (0, strftime_1.default)('%FT%T%z', this.date).replace('+0900', '+09:00')
        };
    }
}
exports.default = Bulk;

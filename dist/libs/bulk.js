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
const strftime_1 = __importDefault(require("strftime"));
const job_1 = __importDefault(require("./job"));
const email_1 = __importDefault(require("./email"));
const tmp_promise_1 = require("tmp-promise");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
class Bulk extends base_1.default {
    constructor() {
        super(...arguments);
        this.to = [];
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = '/deliveries/bulk/begin';
            const res = yield Bulk.request.send('post', url, this.saveParams());
            this.delivery_id = res.delivery_id;
            return res;
        });
    }
    import(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.delivery_id}/emails/import`;
            const res = yield Bulk.request.send('post', url, {
                file: filePath
            });
            return new job_1.default(res.job_id);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const params = this.updateParams();
            if (params.to && (params === null || params === void 0 ? void 0 : params.to.length) > 50) {
                const csv = this.createCsv(params.to);
                const { path, cleanup } = yield (0, tmp_promise_1.file)({ postfix: '.csv' });
                yield (0, util_1.promisify)(fs_1.default.writeFile)(path, csv);
                const job = yield this.import(path);
                while (job.finished() === false) {
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                }
                delete params.to;
            }
            const url = `/deliveries/bulk/update/${this.delivery_id}`;
            const res = yield Bulk.request.send('put', url, params);
            return res;
        });
    }
    createCsv(to) {
        var _a, _b, _c;
        // ヘッダーを作る
        const headers = ['email'];
        for (const t of to) {
            const params = ((_a = t.insert_code) === null || _a === void 0 ? void 0 : _a.map((c) => c.key)) || [];
            for (const p of params) {
                if (!headers.includes(p))
                    headers.push(p);
            }
        }
        const lines = [`"${headers.join('","')}"`];
        for (const t of to) {
            const params = ((_b = t.insert_code) === null || _b === void 0 ? void 0 : _b.map((c) => c.key)) || [];
            const values = [t.email];
            for (const h of headers) {
                if (h === 'email')
                    continue;
                const code = (_c = t.insert_code) === null || _c === void 0 ? void 0 : _c.find((c) => c.key === h);
                values.push(code ? code.value.replace('"', '""') : '');
            }
            lines.push(`"${values.join('","')}"`);
        }
        return lines.join('\n');
    }
    send(date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = date ?
                `/deliveries/bulk/commit/${this.delivery_id}` :
                `/deliveries/bulk/commit/${this.delivery_id}/immediate`;
            this.date = date;
            const res = yield Bulk.request.send('patch', url, this.commitParams());
            return res;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.delivery_id}`;
            const res = yield Bulk.request.send('delete', url);
            return res;
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.delivery_id)
                throw 'Delivery id is not found.';
            const url = `/deliveries/${this.delivery_id}/cancel`;
            const res = yield Bulk.request.send('patch', url);
            return res;
        });
    }
    email() {
        if (!this.delivery_id)
            throw 'Delivery id is not found.';
        return new email_1.default(this.delivery_id);
    }
    setTo(email, insertCode) {
        const params = { email };
        if (insertCode) {
            const ary = Array.isArray(insertCode) ? insertCode : [insertCode];
            params.insert_code = ary.map(insertCode => {
                return {
                    key: `__${Object.keys(insertCode)[0]}__`,
                    value: Object.values(insertCode)[0],
                };
            });
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
        if (!this.date)
            return {};
        strftime_1.default.timezone(9 * 60);
        return {
            reservation_time: (0, strftime_1.default)('%FT%T%z', this.date).replace('+0900', '+09:00')
        };
    }
}
exports.default = Bulk;

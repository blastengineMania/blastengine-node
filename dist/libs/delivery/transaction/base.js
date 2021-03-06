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
class Base {
    constructor() {
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
    getRequest(method, url) {
        switch (method.toUpperCase()) {
            case 'GET':
                return superagent_1.default.get(url);
            case 'POST':
                return superagent_1.default.post(url);
            case 'PUT':
                return superagent_1.default.put(url);
            case 'DELETE':
                return superagent_1.default.delete(url);
            case 'PATCH':
                return superagent_1.default.patch(url);
            default:
                throw `${method} is not support.`;
        }
    }
    req(method, url, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = this.getRequest(method, url);
                request
                    .set('Authorization', `Bearer ${(_a = Base.client) === null || _a === void 0 ? void 0 : _a.token}`);
                if (this.attachments.length > 0) {
                    const res = yield this.sendAttachment(request, params);
                    return res.body;
                }
                else {
                    const res = yield this.sendJson(request, params);
                    return res.body;
                }
            }
            catch (e) {
                console.error(e);
                if ('response' in e) {
                    throw e.response.text;
                }
                throw e;
            }
        });
    }
    sendJson(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return request
                .send(params)
                .set('Content-Type', 'application/json');
        });
    }
    sendAttachment(request, params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const file of this.attachments) {
                request.attach('file', file);
            }
            if (params) {
                request
                    .attach('data', Buffer.from(JSON.stringify(params)), { contentType: 'application/json' });
            }
            return request
                .type('form');
        });
    }
}
exports.default = Base;
